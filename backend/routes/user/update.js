const express = require("express");
const router = express.Router();
const {return404Status, getUser, STATUS_CODES, correctQuestionNumberFormat, sendMsg} = require("../../src/Utility");

async function setCorrect(isCorrect, qNum, user) {
    const questionNum = qNum.toUpperCase();

    if(isCorrect.toString().toLowerCase() === "true") {
        user.correct = [...new Set(user.correct).add(questionNum)];
        user.wrong = user.wrong.filter(x => x !== questionNum);
    } else {
        user.wrong = [...new Set(user.wrong).add(questionNum)];
        user.correct = user.correct.filter(x => x !== questionNum);
    }
}

// Client-side note: must be a post request to work
router.post("/correct", async (req, res) => {
    const {isCorrect, qNum} = req.query;
    if(!req.user) return sendMsg(res, "User needs to login.", 400);

    const user = await getUser(req.user.ID);

    if(!user || !isCorrect || !qNum || !correctQuestionNumberFormat(qNum)) return return404Status(res);

    setCorrect(isCorrect, qNum, user);
    await user.save().catch(err => console.log(err));

    res.json(STATUS_CODES.OK);
});


router.post("/correctmany", async (req, res) => {
    const unparsedArr = req.query?.arr;

    if(!req.user) return sendMsg(res, "User needs to login.", 400);

    const user = await getUser(req.user.ID);

    if(!user || !unparsedArr) return return404Status(res);

    const correctsOrWrongs = JSON.parse(unparsedArr);


    for(const {isCorrect, questionNum} of correctsOrWrongs) {
        setCorrect(isCorrect, questionNum, user);
    }

    await user.save().catch(err => console.log(err));

    res.json(STATUS_CODES.OK);
});


module.exports = router;