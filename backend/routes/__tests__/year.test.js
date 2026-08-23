// Keeps mongoose (and a database) out of these tests.
jest.mock("../../models/User.model.js", () => ({findOne: jest.fn()}));

const express = require("express");
const request = require("supertest");

const User = require("../../models/User.model.js");

const MATH_YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026];

// The year routes are mounted under /api/<subject>/year by routes/index.js.
function serve(subject, user) {
    const app = express();

    if(user) app.use((req, res, next) => {
        req.user = user;
        next();
    });

    app.use(`/api/${ subject }/year`, require(`../${ subject }/year.js`));

    return app;
}

const mathApp = serve("math");
const physicsApp = serve("physics");

const yearOf = (question) => question.questionNum.replace(/^f/i, "").split("-")[0];

describe.each([
    ["math", () => mathApp, "", 31],
    ["physics", () => physicsApp, "f", 20]
])("GET /api/%s/year/:year", (subject, app, prefix, perYear) => {
    it.each(MATH_YEARS)("serves %i's own questions", async (year) => {
        const res = await request(app()).get(`/api/${ subject }/year/${ year }`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(perYear);
        expect(res.body.every((q) => yearOf(q) === String(year))).toBe(true);
        expect(res.body[0].questionNum).toBe(`${ prefix }${ year }-1`);
    });

    it("serves 2019, not 2021", async () => {
        // The route sliced the array at (2022 - year) * n. With no 2020 exam in the
        // data that returned the next-newer exam for every year up to 2019, so
        // asking for 2019 answered with the 2021 questions.
        const res = await request(app()).get(`/api/${ subject }/year/2019`);

        expect(res.body.map((q) => q.questionNum)).toContain(`${ prefix }2019-1`);
        expect(res.body.map((q) => q.questionNum)).not.toContain(`${ prefix }2021-1`);
    });

    it("does not shift any year by a whole exam", async () => {
        const served = await Promise.all(
            MATH_YEARS.map(async (year) => {
                const res = await request(app()).get(`/api/${ subject }/year/${ year }`);
                return {year, servedYear: Number(yearOf(res.body[0]))};
            })
        );

        expect(served.filter((s) => s.servedYear !== s.year)).toEqual([]);
    });

    it.each([2020, 2006, 2027, "abc", "1", "2019-1"])("reports not found for %p", async (year) => {
        const res = await request(app()).get(`/api/${ subject }/year/${ year }`);

        expect(res.body).toEqual({code: 404, msg: "Not found"});
    });

    it("does not answer with an error object where the client expects a list", async () => {
        // The client assigns the response straight into its question list, so an
        // object here used to crash the page on .map().
        const ok = await request(app()).get(`/api/${ subject }/year/2019`);
        const notFound = await request(app()).get(`/api/${ subject }/year/2020`);

        expect(Array.isArray(ok.body)).toBe(true);
        expect(Array.isArray(notFound.body)).toBe(false);
    });
});

describe("GET /api/math/year/:year for a signed-in user", () => {
    afterEach(() => User.findOne.mockReset());

    it("marks the questions the user has already answered", async () => {
        User.findOne.mockResolvedValue({ID: "1", correct: ["2019-1"], wrong: ["2019-2"]});

        const res = await request(serve("math", {ID: "1"})).get("/api/math/year/2019");

        expect(res.body[0]).toMatchObject({questionNum: "2019-1", isCorrect: true});
        expect(res.body[1]).toMatchObject({questionNum: "2019-2", isCorrect: false});
        expect(res.body[2].isCorrect).toBeUndefined();
    });

    it("still serves the questions when the user record is gone", async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(serve("math", {ID: "gone"})).get("/api/math/year/2019");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(31);
    });
});
