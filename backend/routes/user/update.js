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

    // An unguarded JSON.parse threw for malformed input, which left the request
    // without a response instead of reporting the bad payload.
    let correctsOrWrongs;

    try {
        correctsOrWrongs = JSON.parse(unparsedArr);
    } catch(e) {
        return sendMsg(res, "Invalid payload.", 400);
    }

    if(!Array.isArray(correctsOrWrongs)) return sendMsg(res, "Invalid payload.", 400);

    for(const entry of correctsOrWrongs) {
        // The single-question endpoint validates the question id; this one did not,
        // so arbitrary strings could be written to the user's correct/wrong lists.
        if(!entry || !entry.questionNum || !correctQuestionNumberFormat(entry.questionNum)) continue;

        setCorrect(entry.isCorrect, entry.questionNum, user);
    }

    await user.save().catch(err => console.log(err));

    res.json(STATUS_CODES.OK);
});


module.exports = router;