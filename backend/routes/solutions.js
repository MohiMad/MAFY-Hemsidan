const express = require("express");
const router = express.Router();
const Solution = require("../models/Solution.model");
const {getUser, sendMsg, correctQuestionNumberFormat, getUsersForSolutions} = require("../src/Utility");

router.get("/:questionNum", async (req, res) => {
    const questionNum = req.params.questionNum;
    if(!correctQuestionNumberFormat(questionNum)) return sendMsg(res, "Invalid question ID.", 400);

    const questionSolutionDoc = await Solution.findOne({questionNum: questionNum.toUpperCase()});

    if(!questionSolutionDoc) return sendMsg(res, "No solutions found.", 404);

    const resSolutionsDoc = await getUsersForSolutions(questionSolutionDoc);

    res.json(resSolutionsDoc);
});

router.get("/delete/:questionNum", async (req, res) => {
    const questionNum = req.params.questionNum;
    const user = await getUser(req?.user?.ID);
    if(!correctQuestionNumberFormat(questionNum)) return sendMsg(res, "Invalid question ID.", 400);
    if(!user) return sendMsg(res, "No user found.", 400);

    const solutionDoc = await Solution.findOne({questionNum: questionNum.toUpperCase()});
    // TODO: Gör klart det här. Och använd Image ID för att identifiera dokument som ska tas bort


});

module.exports = router;