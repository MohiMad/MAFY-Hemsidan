const express = require("express");
const router = express.Router();
const math = require("../../public/json/math.json");
const {STATUS_CODES, mergeData} = require("../../src/Utility");

router.get("/:year", async (req, res) => {
    const year = Number(req.params.year);
    let bounds = [(2022 - year) * 31, (2022 - year) * 31 + 31];

    if(year === 2020 || year < 2007 || year > 2023 || isNaN(year)) {
        return res.json(STATUS_CODES.NOT_FOUND);
    }
    else if(year > 2020) {
        bounds = [(2023 - year) * 31, (2023 - year) * 31 + 31];
    }

    const yearQuestions = await mergeData(math.slice(bounds[0], bounds[1]), req.user);

    res.json(yearQuestions);
});

module.exports = router;