jest.mock("../../models/User.model.js", () => ({findOne: jest.fn()}));

const express = require("express");
const request = require("supertest");

const User = require("../../models/User.model.js");

function serve(user) {
    const app = express();

    if(user) app.use((req, res, next) => {
        req.user = user;
        next();
    });

    app.use("/api/user/update", require("../user/update.js"));

    return app;
}

function userRecord() {
    return {ID: "1", correct: [], wrong: [], save: jest.fn().mockResolvedValue(undefined)};
}

describe("POST /api/user/update/correct", () => {
    afterEach(() => User.findOne.mockReset());

    it("records a correct answer", async () => {
        const user = userRecord();
        User.findOne.mockResolvedValue(user);

        const res = await request(serve({ID: "1"})).post("/api/user/update/correct?qNum=2019-1&isCorrect=true");

        expect(res.body).toEqual({code: 200, msg: "ok"});
        expect(user.correct).toEqual(["2019-1"]);
        expect(user.wrong).toEqual([]);
        expect(user.save).toHaveBeenCalled();
    });

    it("records a wrong answer and clears a previous correct one", async () => {
        const user = {...userRecord(), correct: ["2019-1"]};
        User.findOne.mockResolvedValue(user);

        await request(serve({ID: "1"})).post("/api/user/update/correct?qNum=2019-1&isCorrect=false");

        expect(user.correct).toEqual([]);
        expect(user.wrong).toEqual(["2019-1"]);
    });

    it("stores the id uppercased, so Del C matches on the way back out", async () => {
        const user = userRecord();
        User.findOne.mockResolvedValue(user);

        await request(serve({ID: "1"})).post("/api/user/update/correct?qNum=2019-c&isCorrect=true");

        expect(user.correct).toEqual(["2019-C"]);
    });

    it("does not record the same question twice", async () => {
        const user = {...userRecord(), correct: ["2019-1"]};
        User.findOne.mockResolvedValue(user);

        await request(serve({ID: "1"})).post("/api/user/update/correct?qNum=2019-1&isCorrect=true");

        expect(user.correct).toEqual(["2019-1"]);
    });

    it("requires a signed-in user", async () => {
        const res = await request(serve()).post("/api/user/update/correct?qNum=2019-1&isCorrect=true");

        expect(res.body).toEqual({msg: "User needs to login.", code: 400});
    });

    it("rejects a question id that does not exist", async () => {
        User.findOne.mockResolvedValue(userRecord());

        const res = await request(serve({ID: "1"})).post("/api/user/update/correct?qNum=2020-1&isCorrect=true");

        expect(res.body).toEqual({code: 404, msg: "Not found"});
    });
});

describe("POST /api/user/update/correctmany", () => {
    afterEach(() => User.findOne.mockReset());

    it("records a batch of answers", async () => {
        const user = userRecord();
        User.findOne.mockResolvedValue(user);

        const arr = JSON.stringify([
            {questionNum: "2019-1", isCorrect: true},
            {questionNum: "2019-2", isCorrect: false},
            {questionNum: "f2019-3", isCorrect: true}
        ]);

        const res = await request(serve({ID: "1"})).post(`/api/user/update/correctmany?arr=${ encodeURIComponent(arr) }`);

        expect(res.body).toEqual({code: 200, msg: "ok"});
        expect(user.correct).toEqual(["2019-1", "F2019-3"]);
        expect(user.wrong).toEqual(["2019-2"]);
    });

    it("answers with an error instead of hanging on malformed JSON", async () => {
        // An unguarded JSON.parse threw inside the async handler, so the request
        // never got a response and the client waited until it timed out.
        User.findOne.mockResolvedValue(userRecord());

        const res = await request(serve({ID: "1"})).post("/api/user/update/correctmany?arr=not-json");

        expect(res.body).toEqual({msg: "Invalid payload.", code: 400});
    });

    it("rejects a payload that is not a list", async () => {
        User.findOne.mockResolvedValue(userRecord());

        const res = await request(serve({ID: "1"})).post(`/api/user/update/correctmany?arr=${ encodeURIComponent('{"a":1}') }`);

        expect(res.body).toEqual({msg: "Invalid payload.", code: 400});
    });

    it("skips entries whose question id does not exist", async () => {
        // This endpoint did not validate ids, so anything could be written into
        // the user's correct/wrong lists.
        const user = userRecord();
        User.findOne.mockResolvedValue(user);

        const arr = JSON.stringify([
            {questionNum: "2019-1", isCorrect: true},
            {questionNum: "2020-1", isCorrect: true},
            {questionNum: "inte-en-fråga", isCorrect: true},
            null
        ]);

        const res = await request(serve({ID: "1"})).post(`/api/user/update/correctmany?arr=${ encodeURIComponent(arr) }`);

        expect(res.body).toEqual({code: 200, msg: "ok"});
        expect(user.correct).toEqual(["2019-1"]);
    });

    it("requires a signed-in user", async () => {
        const res = await request(serve()).post("/api/user/update/correctmany?arr=%5B%5D");

        expect(res.body).toEqual({msg: "User needs to login.", code: 400});
    });
});
