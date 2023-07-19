require('dotenv').config();
const Session = require("../models/Session.model.js");
const cookieParser = require("cookie-parser");

module.exports = {
    serialize: async (req, user) => {
        console.log("i run");
        req.session.user = user;
        req.user = user;

        const session = new Session({
            sessionID: req.sessionID,
            expiresAt: req.session.cookie.expires,
            data: JSON.stringify({ID: user.ID})
        });

        await session.save().catch(err => console.log(err));

        return session;
    },

    deserialize: async (req, res, next) => {
        if(!req.cookies) return next();

        const {DISCORD_OAUTH2_SESSION_ID} = req.cookies;
        if(!DISCORD_OAUTH2_SESSION_ID) return next();
        console.log("DISCORD_OAUTH2_SESSION_ID found");

        const sessionId = cookieParser
            .signedCookie(DISCORD_OAUTH2_SESSION_ID, process.env.SECRET)
            .toString();

        const session = await Session.findOne({sessionID: sessionId});


        if(!session) {
            console.log("No session found");
            return next();
        }

        const currentTime = new Date();

        if(session.expiresAt < currentTime) {
            await session.delete({}).catch(e => console.log(e));
        } else {
            const data = JSON.parse(session.data);
            req.user = data;
        }

        next();
    }
};