const express = require("express");
const router = express.Router();
const physics = require("../../public/json/physics.json");
const {STATUS_CODES, mergeData} = require("../../src/Utility");

router.get("/:year", async (req, res) => {
    const year = Number(req.params.year);
    let bounds = [(2022 - year) * 20, (2022 - year) * 20 + 20];

    if(year === 2020 || year < 2007 || year > 2023 || isNaN(year)) {
        return res.json(STATUS_CODES.NOT_FOUND);
    }
    else if(year > 2020) {
        bounds = [(2023 - year) * 20, (2023 - year) * 20 + 20];
    }

    const yearQuestions = await mergeData(physics.slice(bounds[0], bounds[1]), req.user);

    res.json(yearQuestions);
});

module.exports = router;