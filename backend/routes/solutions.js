const express = require("express");
const router = express.Router();
const Solution = require("../models/Solution.model");
const {sendMsg, correctQuestionNumberFormat, getUsersForSolutions, getStaticSolution} = require("../src/Utility");
const imgur = require("imgur");

router.get("/:questionNum", async (req, res) => {
    const questionNum = req.params.questionNum;
    if(!correctQuestionNumberFormat(questionNum)) return sendMsg(res, "Invalid question ID.", 400);

    const questionSolutionDoc = await Solution.findOne({questionNum: questionNum.toUpperCase()});

    if(!questionSolutionDoc) return sendMsg(res, "No solutions found.", 404);

    const resSolutionsDoc = await getUsersForSolutions(questionSolutionDoc);
    const staticSolution = getStaticSolution(questionNum);

    if(staticSolution) {
        resSolutionsDoc.solutions = [staticSolution, ...resSolutionsDoc.solutions];
    }

    res.json(resSolutionsDoc);
});

router.post("/delete/:questionNum/:solutionID", async (req, res) => {
    const {questionNum, solutionID} = req.params;
    const userID = req?.user?.ID;

    if(!correctQuestionNumberFormat(questionNum)) return sendMsg(res, "Invalid question ID.", 400);
    if(!userID) return sendMsg(res, "No user found.", 400);

    const solutionDoc = await Solution.findOne({questionNum: questionNum.toUpperCase()});
    if(!solutionDoc) return sendMsg(res, "Not found.", 400);

    const solutionInSolutionsArr = solutionDoc.solutions.find(x => x.solutionID === solutionID);
    if(!solutionInSolutionsArr) return sendMsg(res, "Not found.", 400);
    if(solutionInSolutionsArr.ID !== userID) return sendMsg(res, "Unauthorized.", 400);

    if(solutionInSolutionsArr.deletehash) {
        await imgur.deleteImage(solutionInSolutionsArr.deletehash).catch(err => console.log(err));
    }

    solutionDoc.solutions = [...solutionDoc.solutions.filter(x => x.solutionID !== solutionID)];
    await solutionDoc.save().catch(err => console.log(err));

    sendMsg(res, "ok", 200);
});

module.exports = router;