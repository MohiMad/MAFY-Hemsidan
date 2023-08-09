require('dotenv').config();
const Session = require("../models/Session.model.js");
const cookieParser = require("cookie-parser");

module.exports = {
    serialize: async (req, user) => {
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

        try {
            const sessionId = cookieParser
                .signedCookie(DISCORD_OAUTH2_SESSION_ID, process.env.SECRET)
                .toString();

            const session = await Session.findOne({sessionID: sessionId});

            if(session) {
                const currentTime = new Date();

                if(session.expiresAt >= currentTime) {
                    const data = JSON.parse(session.data);
                    req.user = data;
                } else {
                    // Session has expired, delete it
                    await session.delete();
                }
            }
        } catch(error) {
            console.error("Error during session deserialization:", error);
        }

        next();
    }
};