const express = require("express");
const router = express.Router();
const {sendMsg, getUser} = require("../../src/Utility");


router.get("/", async (req, res) => {
    console.log(req.user);
    const user = await getUser(req?.user?.ID);

    if(!user) return sendMsg(res, "No user found.", 400);

    delete user._doc._id;
    delete user._doc.accessToken;
    delete user._doc.refreshToken;
    delete user._doc.__v;

    res.json(user._doc);
});

module.exports = router;