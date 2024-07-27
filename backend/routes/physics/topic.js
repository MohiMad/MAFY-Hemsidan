const express = require("express");
const router = express.Router();
const physics = require("../../public/json/physics.json");
const {STATUS_CODES, getMergedTopicQuestions} = require("../../src/Utility");

router.get("/:topic", async (req, res) => {
    const topic = req.params.topic;
    const mergedTopicQuestions = await getMergedTopicQuestions(physics, req.user, topic);

    if(!mergedTopicQuestions) {
        return res.json(STATUS_CODES.NOT_FOUND);
    }

    res.json(mergedTopicQuestions);
});

module.exports = router;