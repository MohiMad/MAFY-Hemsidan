require('dotenv').config();
const express = require("express");
const router = express.Router();
const {getOAuthData, getDiscordUser} = require("../../services/auth.js");
const {serialize} = require('../../src/Session.js');
const {encryptTokens, createUser} = require("../../src/Utility.js");


router.get("/", async (req, res) => {
    const {code} = req.query;
    console.log("we here...", code);

    if(req.user) return res.redirect(process.env.domain);

    if(code) {
        try {
            const {access_token, refresh_token} = await getOAuthData(code);
            console.log("ref", refresh_token);
            const userRes = await getDiscordUser(access_token);
            console.log("user ba", userRes);
            const {accessToken, refreshToken} = encryptTokens(access_token, refresh_token);
            const user = await createUser(userRes, accessToken, refreshToken);
            await serialize(req, user);

        } catch(error) {
            console.log(error);
        }
    }

    return res.redirect(process.env.domain);
});

module.exports = router;