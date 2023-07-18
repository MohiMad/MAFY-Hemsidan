const express = require("express");
const router = express.Router();
const Solution = require("../models/Solution.model");
const {sendMsg, correctQuestionNumberFormat, getUsersForSolutions} = require("../src/Utility");

router.get("/:questionNum", async (req, res) => {
    const questionNum = req.params.questionNum;
    if(!correctQuestionNumberFormat(questionNum)) return sendMsg(res, "Invalid question ID.", 400);

    const questionSolutionDoc = await Solution.findOne({questionNum: questionNum.toUpperCase()});

    if(!questionSolutionDoc) return sendMsg(res, "No solutions found.", 404);

    const resSolutionsDoc = await getUsersForSolutions(questionSolutionDoc);

    res.json(resSolutionsDoc);
});

module.exports = router;