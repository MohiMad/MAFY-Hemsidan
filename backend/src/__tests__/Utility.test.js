// Keeps mongoose (and a database) out of these tests; only User.findOne is reached.
jest.mock("../../models/User.model.js", () => ({findOne: jest.fn()}));

const {
    getYearQuestions,
    correctQuestionNumberFormat,
    mergeData,
    getMergedTopicQuestions,
    getStaticSolution
} = require("../Utility");

const User = require("../../models/User.model.js");
const math = require("../../public/json/math.json");
const physics = require("../../public/json/physics.json");

const MATH_YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026];

const yearOf = (question) => question.questionNum.replace(/^f/i, "").split("-")[0];

describe("getYearQuestions", () => {
    // The exams are stored newest-first with no 2020 exam. The route used to slice
    // the array at (2022 - year) * 31, so every year up to 2019 returned the
    // next-newer exam: asking for 2019 served the 2021 questions.
    it.each(MATH_YEARS)("returns only %i's questions for matematik", (year) => {
        const questions = getYearQuestions(math, year);

        expect(questions).toHaveLength(31);
        expect(questions.every((q) => yearOf(q) === String(year))).toBe(true);
    });

    it.each(MATH_YEARS)("returns only %i's questions for fysik", (year) => {
        const questions = getYearQuestions(physics, year);

        expect(questions).toHaveLength(20);
        expect(questions.every((q) => yearOf(q) === String(year))).toBe(true);
    });

    it("does not serve a neighbouring year around the missing 2020 exam", () => {
        expect(getYearQuestions(math, 2019).map((q) => q.questionNum)).toContain("2019-1");
        expect(getYearQuestions(math, 2019).map((q) => q.questionNum)).not.toContain("2021-1");
        expect(getYearQuestions(math, 2021).map((q) => q.questionNum)).toContain("2021-1");
        expect(getYearQuestions(physics, 2019).map((q) => q.questionNum)).toContain("f2019-1");
        expect(getYearQuestions(physics, 2019).map((q) => q.questionNum)).not.toContain("f2021-1");
    });

    it("accepts the year as a string, the way it arrives from the URL", () => {
        expect(getYearQuestions(math, "2019")).toEqual(getYearQuestions(math, 2019));
    });

    it("returns nothing for 2020, which was never held", () => {
        expect(getYearQuestions(math, 2020)).toEqual([]);
        expect(getYearQuestions(physics, 2020)).toEqual([]);
    });

    it.each([2006, 2027, "abc", "", "19", "2019-1", "20191", null, undefined])(
        "returns nothing for the invalid year %p",
        (year) => {
            expect(getYearQuestions(math, year)).toEqual([]);
        }
    );

    it("never matches a year against the question number part of the id", () => {
        // "1" used to match "2011-1", "2012-1", ... via a substring search.
        expect(getYearQuestions(math, "1")).toEqual([]);
    });

    it("keeps the questions in ascending order within the year", () => {
        const numbers = getYearQuestions(math, 2019).map((q) => q.questionNum.split("-")[1]);

        expect(numbers.slice(0, 5)).toEqual(["1", "2", "3", "4", "5"]);
        expect(numbers[numbers.length - 1]).toBe("C");
    });
});

describe("correctQuestionNumberFormat", () => {
    it.each(["2019-1", "2019-30", "2019-C", "2019-c", "f2019-1", "f2019-20", "2024-15", "2007-1", "2025-1", "2026-C", "f2026-20"])(
        "accepts %s",
        (qNum) => {
            expect(correctQuestionNumberFormat(qNum)).toBe(true);
        }
    );

    it.each(["2020-1", "2006-1", "2027-1", "2019-0", "2019-31", "2019-", "2019", "-1", "", "2019-1; DROP", "x2019-1"])(
        "rejects %p",
        (qNum) => {
            expect(correctQuestionNumberFormat(qNum)).toBe(false);
        }
    );

    it("accepts every id that actually exists in the data", () => {
        const rejected = math.concat(physics)
            .map((q) => q.questionNum)
            .filter((qNum) => !correctQuestionNumberFormat(qNum));

        expect(rejected).toEqual([]);
    });
});

describe("mergeData", () => {
    const data = [{questionNum: "2019-1"}, {questionNum: "2019-2"}, {questionNum: "2019-C"}];

    afterEach(() => User.findOne.mockReset());

    it("returns the data untouched when there is no user", async () => {
        expect(await mergeData(data, null)).toEqual(data);
        expect(User.findOne).not.toHaveBeenCalled();
    });

    it("marks answered questions as correct or wrong", async () => {
        User.findOne.mockResolvedValue({ID: "1", correct: ["2019-1"], wrong: ["2019-C"]});

        const merged = await mergeData(data, {ID: "1"});

        expect(merged[0]).toEqual({questionNum: "2019-1", isCorrect: true});
        expect(merged[1]).toEqual({questionNum: "2019-2"});
        expect(merged[2]).toEqual({questionNum: "2019-C", isCorrect: false});
    });

    it("compares ids case-insensitively, since they are stored uppercase", async () => {
        User.findOne.mockResolvedValue({ID: "1", correct: ["2019-C"], wrong: []});

        const merged = await mergeData([{questionNum: "2019-c"}], {ID: "1"});

        expect(merged[0].isCorrect).toBe(true);
    });

    it("does not mutate the source data", async () => {
        User.findOne.mockResolvedValue({ID: "1", correct: ["2019-1"], wrong: []});

        await mergeData(data, {ID: "1"});

        expect(data[0]).toEqual({questionNum: "2019-1"});
    });

    it("falls back to the plain data when the session points at a deleted user", async () => {
        // This used to throw on userData.correct, turning every request into a 500.
        User.findOne.mockResolvedValue(null);

        await expect(mergeData(data, {ID: "gone"})).resolves.toEqual(data);
    });
});

describe("getMergedTopicQuestions", () => {
    const topic = math[0].keywords[0];

    it("returns the questions for a known topic", async () => {
        const questions = await getMergedTopicQuestions(math, null, topic);

        expect(questions.length).toBeGreaterThan(0);
        expect(questions.every((q) => q.keywords[0].toLowerCase() === topic.toLowerCase())).toBe(true);
    });

    it("matches the topic case-insensitively", async () => {
        expect(await getMergedTopicQuestions(math, null, topic.toUpperCase()))
            .toEqual(await getMergedTopicQuestions(math, null, topic));
    });

    it("returns undefined for an unknown topic", async () => {
        // An empty array is truthy, so this used to answer 200 with [] and the
        // client rendered an error payload as the question list.
        expect(await getMergedTopicQuestions(math, null, "finns-inte")).toBeUndefined();
    });

    it("no longer treats 'annat' as a topic", async () => {
        // The keyword-grouping heuristic and its "annat" bucket are gone; keywords[0]
        // is now always one of the curated broad categories.
        expect(await getMergedTopicQuestions(math, null, "annat")).toBeUndefined();
        expect(await getMergedTopicQuestions(physics, null, "annat")).toBeUndefined();
    });
});

describe("getStaticSolution", () => {
    it("finds a solution for a numbered question", () => {
        expect(getStaticSolution("2024-1")).toMatchObject({name: "ChatGPT", type: "latex"});
    });

    it("finds the Del C solution, whose id is stored uppercase", () => {
        // The lookup lowercased the whole id, so "2024-C" never matched.
        expect(getStaticSolution("2024-C")).not.toBeNull();
        expect(getStaticSolution("2024-c")).not.toBeNull();
    });

    it("has a solution for every matematik question up to 2024", () => {
        // The 2025 and 2026 entries were added without the ChatGPT solution field.
        const missing = math
            .filter((q) => Number(q.questionNum.split("-")[0]) <= 2024)
            .filter((q) => !q.solution);

        expect(missing).toEqual([]);
    });

    it("has no solution for the 2025 and 2026 questions yet", () => {
        const years = [...new Set(math.filter((q) => !q.solution).map((q) => q.questionNum.split("-")[0]))].sort();

        expect(years).toEqual(["2025", "2026"]);
        expect(getStaticSolution("2026-1")).toBeNull();
    });

    it("has no fysik solutions to serve", () => {
        // physics.json carries no solution field at all, so this returns null for
        // every fysik question. The caller in routes/solutions.js is currently
        // commented out; re-enabling it would work for matematik only.
        expect(physics.some((q) => q.solution)).toBe(false);
        expect(getStaticSolution("f2024-1")).toBeNull();
    });

    it("returns null when the question does not exist", () => {
        expect(getStaticSolution("2019-99")).toBeNull();
    });
});
