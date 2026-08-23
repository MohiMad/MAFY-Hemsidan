const express = require("express");
const router = express.Router();
const {sendMsg, getUser, correctQuestionNumberFormat, getUsersForSolutions} = require("../../src/Utility");
const imgur = require("imgur");
const fs = require("fs");
const os = require("os");
const path = require("path");
const Solution = require("../../models/Solution.model");

router.post("/solution/image/:questionNum", async (req, res) => {
    if(!req.files || !req.files.sampleFile) return sendMsg(res, "Inga filer hittades.", 400);
    if(!req.params.questionNum || !correctQuestionNumberFormat(req.params.questionNum)) return sendMsg(res, "Frågan du försöker ladda upp lösningen till hittades ej.", 400);

    const questionNum = req.params.questionNum;

    const user = await getUser(req?.user?.ID);

    if(!user) return sendMsg(res, "Du måste logga in för att kunna ladda upp lösningar.", 400);

    const sampleFile = req.files.sampleFile;
    // The uploaded filename is not used for the path: two people uploading
    // "solution.png" at the same time overwrote each other's temp file, and the
    // second unlink then failed.
    const uploadPath = path.join(os.tmpdir(), `mafy-${ user.ID }-${ Date.now() }${ path.extname(sampleFile.name) }`);

    if(!/^image\//i.test(sampleFile.mimetype)) return sendMsg(res, "Filen måste vara en bild.", 400);

    sampleFile.mv(uploadPath, async function (err) {
        if(err) {
            return res.status(500).send(err);
        }

        try {
            const urlObject = await imgur.uploadFile(uploadPath).catch(e => void console.log("imgur upload failed", e));

            // Without this the handler threw on urlObject.id and never answered,
            // leaving the client waiting forever.
            if(!urlObject) {
                return sendMsg(res, "Lösningen gick inte att ladda upp. Försök igen.", 502);
            }

            const image = urlObject.data || urlObject;
            const solutions = await Solution.findOne({questionNum: questionNum.toUpperCase()});

            const userSolutionObj = {
                ID: user.ID,
                solutionID: image.id,
                uploadedAt: Date.now(),
                solution: image.link,
                type: image.type,
                deletehash: image.deletehash,
                width: image.width,
                height: image.height,
            };

            let solutionsDoc;

            if(!solutions) {
                const newSolutionsDoc = new Solution({
                    questionNum: questionNum.toUpperCase(),
                    solutions: [userSolutionObj]
                });

                await newSolutionsDoc.save();
                solutionsDoc = newSolutionsDoc;
            } else {
                solutions.solutions = [...solutions.solutions, userSolutionObj];
                await solutions.save();
                solutionsDoc = solutions;
            }

            const resSolutionsDoc = await getUsersForSolutions(solutionsDoc);

            res.json(resSolutionsDoc);
        } catch(e) {
            console.log(e);
            sendMsg(res, "Lösningen gick inte att ladda upp. Försök igen.", 500);
        } finally {
            fs.promises.unlink(uploadPath).catch(() => void (0));
        }
    });
});

router.post("/solution/latex/:questionNum", async (req, res) => {
    if(!req.body || !req.body.latex) return sendMsg(res, "Ingen latex-kod hittades.", 400);
    if(!req.params.questionNum || !correctQuestionNumberFormat(req.params.questionNum)) return sendMsg(res, "Frågan du försöker ladda upp lösningen till hittades ej.", 400);

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