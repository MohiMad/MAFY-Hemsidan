const {request} = require('undici');
const Utility = require("../src/Utility.js");
const {domain, clientId, clientSecret} = process.env;
const CryptoJS = require("crypto-js");
const axios = require("axios");
const url = require("url");

function createOAuth2SearchParams(code) {
    console.log("domain?", domain);
    return new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code.toString(),
        grant_type: 'authorization_code',
        redirect_uri: `${ domain }/api/login/discord`,
        scope: 'identify',
    }).toString();
}

async function getOAuthData(code) {
    const payload = createOAuth2SearchParams(code);

    const tokenResponseData = await request(Utility.DISCORD_API_ROUTES.OAUTH2_TOKEN, {
        method: 'POST',
        body: payload,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });

    console.log("tokenResponseData", tokenResponseData);

    return tokenResponseData.body.json();
}

async function getDiscordUser(access_token) {
    const userResponse = await request(Utility.DISCORD_API_ROUTES.USER, {
        headers: {
            authorization: `Bearer ${ access_token }`,
        }
    });

    return userResponse.body.json();
}


async function revokeToken(accessToken) {
    const decryptedToken = Utility.decryptToken(accessToken).toString(CryptoJS.enc.Utf8);

    const formData = new url.URLSearchParams({
        client_id: process.env.clientId,
        client_secret: process.env.clientSecret,
        token: decryptedToken,
    });

    return axios.post(
        Utility.DISCORD_API_ROUTES.OAUTH2_TOKEN_REVOKE,
        formData.toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
}

module.exports = {
    getOAuthData,
    getDiscordUser,
    revokeToken,
};