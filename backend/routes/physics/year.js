const express = require("express");
const router = express.Router();
const physics = require("../../public/json/physics.json");
const {STATUS_CODES, mergeData, getYearQuestions} = require("../../src/Utility");

router.get("/:year", async (req, res) => {
    const questions = getYearQuestions(physics, req.params.year);

    if(!questions.length) {
        return res.json(STATUS_CODES.NOT_FOUND);
    }

    const yearQuestions = await mergeData(questions, req.user);

    res.json(yearQuestions);
});

module.exports = router;
