const express = require("express");
const router = express.Router();
const {sendMsg, getUser, correctQuestionNumberFormat, getUsersForSolutions} = require("../../src/Utility");
const imgur = require("imgur");
const fs = require("fs");
const Solution = require("../../models/Solution.model");

router.post("/solution/image/:questionNum", async (req, res) => {
    if(!req.files) return sendMsg(res, "Inga filer hittades.", 400);
    if(!req.params.questionNum || !correctQuestionNumberFormat(req.params.questionNum)) return sendMsg(res, 400, "Frågan du försöker ladda upp lösningen till hittades ej.");

    const questionNum = req.params.questionNum;

    const user = await getUser(req?.user?.ID);

    if(!user) return sendMsg(res, "Du måste logga in för att kunna ladda upp lösningar.", 400);

    const sampleFile = req.files.sampleFile;
    const uploadPath = __dirname + '/' + sampleFile.name;

    if(!new RegExp("image/*", "i").test(sampleFile.mimetype)) return sendMsg(res, "Filen måste vara en bild.", 400);

    sampleFile.mv(uploadPath, async function (err) {
        if(err) {
            return res.status(500).send(err);
        }

        const urlObject = await imgur.uploadFile(uploadPath).catch(e => console.log("uhoh", e));
        fs.unlinkSync(uploadPath);
        const solutions = await Solution.findOne({questionNum: questionNum.toUpperCase()});

        const userSolutionObj = {
            ID: user.ID,
            solutionID: urlObject?.data?.id || urlObject.id,
            uploadedAt: Date.now(),
            solution: urlObject?.data?.link || urlObject.link,
            type: urlObject?.data?.type || urlObject.type,
            deletehash: urlObject?.data?.deletehash || urlObject.deletehash,
            width: urlObject?.data?.width || urlObject.width,
            height: urlObject?.data?.height || urlObject.height,
        };

        let solutionsDoc;

        if(!solutions) {
            const newSolutionsDoc = new Solution({
                questionNum: questionNum.toUpperCase(),
                solutions: [userSolutionObj]
            });

            await newSolutionsDoc.save().catch(err => console.log(err));
            solutionsDoc = newSolutionsDoc;
        } else {
            solutions.solutions = [...solutions.solutions, userSolutionObj];
            await solutions.save().catch(err => console.log(err));
            solutionsDoc = solutions;
        }

        const resSolutionsDoc = await getUsersForSolutions(solutionsDoc);

        res.json(resSolutionsDoc);
    });
});

router.post("/solution/latex/:questionNum", async (req, res) => {
    if(!req.body.latex) return sendMsg(res, "Ingen latex-kod hittades.", 400);
    if(!req.params.questionNum || !correctQuestionNumberFormat(req.params.questionNum)) return sendMsg(res, 400, "Frågan du försöker ladda upp lösningen till hittades ej.");

    const questionNum = req.params.questionNum;

    const user = await getUser(req?.user?.ID);

    if(!user) return sendMsg(res, "Du måste logga in för att kunna ladda upp lösningar.", 400);

    const solutions = await Solution.findOne({questionNum: questionNum.toUpperCase()});

    const userSolutionObj = {
        ID: user.ID,
        solutionID: Date.now().toString(),
        uploadedAt: Date.now(),
        solution: req.body.latex.toString(),
        type: "latex"
    };

    let solutionsDoc;

    if(!solutions) {
        const newSolutionsDoc = new Solution({
            questionNum: questionNum.toUpperCase(),
            solutions: [userSolutionObj]
        });

        await newSolutionsDoc.save().catch(err => console.log(err));
        solutionsDoc = newSolutionsDoc;
    } else {
        solutions.solutions = [...solutions.solutions, userSolutionObj];
        await solutions.save().catch(err => console.log(err));
        solutionsDoc = solutions;
    }

    const resSolutionsDoc = await getUsersForSolutions(solutionsDoc);

    res.json(resSolutionsDoc);
});

module.exports = router;