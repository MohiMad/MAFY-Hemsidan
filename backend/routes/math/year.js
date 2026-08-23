const express = require("express");
const router = express.Router();
const math = require("../../public/json/math.json");
const {STATUS_CODES, mergeData, getYearQuestions} = require("../../src/Utility");

router.get("/:year", async (req, res) => {
    const questions = getYearQuestions(math, req.params.year);

    if(!questions.length) {
        return res.json(STATUS_CODES.NOT_FOUND);
    }

    const yearQuestions = await mergeData(questions, req.user);

    res.json(yearQuestions);
});

module.exports = router;
