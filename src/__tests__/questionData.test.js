import math from "../assets/json/math.json";
import physics from "../assets/json/physics.json";
import externalSolutions from "../assets/json/externalSolutions.json";
import Utility from "../Utility";

// The exam paging bug came from code that assumed one contiguous block of
// questions per year. These tests pin down what the data actually guarantees, so
// a future data change breaks a test instead of silently serving the wrong exam.

const MATH_YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026];

const yearOf = (question) => question.questionNum.replace(/^f/i, "").split("-")[0];
const numberOf = (question) => question.questionNum.split("-")[1];

describe.each([
    ["matematik", math, "", 31],
    ["fysik", physics, "f", 20]
])("%s question data", (name, data, prefix, perYear) => {
    it("has a question id, question text and answer everywhere", () => {
        for (const question of data) {
            expect(typeof question.questionNum).toBe("string");
            expect(question.question).toBeTruthy();
            expect(question.answer === 0 || Boolean(question.answer)).toBe(true);
            expect(Array.isArray(question.keywords)).toBe(true);
        }
    });

    it("is tagged with keywords for every year", () => {
        // Category and keyword rules live in keywords.test.js.
        expect(data.filter((q) => q.keywords.length === 0)).toEqual([]);
    });

    it("has no duplicate question ids", () => {
        const ids = data.map((q) => q.questionNum);

        expect(ids).toHaveLength(new Set(ids).size);
    });

    it("uses the expected id format throughout", () => {
        const wrong = data.map((q) => q.questionNum).filter((id) => !new RegExp(`^${ prefix }20\\d\\d-([1-9]|[12]\\d|30|C)$`).test(id));

        expect(wrong).toEqual([]);
    });

    it("covers exactly the years the site offers, and no 2020", () => {
        const years = [...new Set(data.map(yearOf))].map(Number).sort((a, b) => a - b);

        expect(years).toEqual(MATH_YEARS);
        expect(years).not.toContain(2020);
    });

    it(`has ${ perYear } questions for every year`, () => {
        for (const year of MATH_YEARS) {
            expect(data.filter((q) => yearOf(q) === String(year))).toHaveLength(perYear);
        }
    });

    it("numbers the questions 1..n with no gaps", () => {
        for (const year of MATH_YEARS) {
            const numbers = data.filter((q) => yearOf(q) === String(year)).map(numberOf);
            const expected = Array.from({length: perYear - (prefix ? 0 : 1)}, (_, i) => String(i + 1));

            expect(numbers).toEqual(prefix ? expected : [...expected, "C"]);
        }
    });
});

describe("multiple-choice questions", () => {
    // The question text carries its own options, split out at render time. If the
    // formatting drifts, the options silently disappear from the page.
    it.each([
        ["matematik", math, /\n\(\w\) /g, (n) => n <= 20],
        ["fysik", physics, /\n\w\.\s/g, (n) => n <= 13]
    ])("%s options split out of the question text", (name, data, separator, isOptionQuestion) => {
        const questions = data.filter((q) => isOptionQuestion(Number(numberOf(q))));

        expect(questions.length).toBeGreaterThan(0);

        for (const question of questions) {
            const options = question.question.split(separator).length - 1;

            // Most have four; fysik also has five-option questions and two
            // three-option ones (f2009-13, f2007-5). Eight is the most the option
            // ids can express.
            expect(options).toBeGreaterThanOrEqual(3);
            expect(options).toBeLessThanOrEqual(8);
        }
    });

    it("renders four options for all but a known handful", () => {
        const unusual = math.concat(physics)
            .filter((q) => {
                const number = Number(numberOf(q));
                return q.questionNum.startsWith("f") ? number <= 13 : number <= 20;
            })
            .filter((q) => {
                const separator = q.questionNum.startsWith("f") ? /\n\w\.\s/g : /\n\(\w\) /g;
                return q.question.split(separator).length - 1 !== 4;
            })
            .map((q) => q.questionNum);

        // Pinned so a formatting change that swallows options shows up here.
        // All of them are fysik: five options, plus f2009-7/f2007-1 with eight and
        // f2009-13/f2007-5 with three. Every matematik question has exactly four.
        expect(unusual).toEqual([
            "f2010-1", "f2010-2", "f2010-3", "f2010-7",
            "f2009-1", "f2009-2", "f2009-3", "f2009-6", "f2009-7", "f2009-10", "f2009-13",
            "f2008-3", "f2008-4",
            "f2007-1", "f2007-2", "f2007-3", "f2007-4", "f2007-5", "f2007-10", "f2007-11", "f2007-12"
        ]);
    });

    it("has an answer naming an option that is actually rendered", () => {
        const optionQuestions = math.concat(physics).filter((q) => {
            const number = Number(numberOf(q));
            return q.questionNum.startsWith("f") ? number <= 13 : number <= 20;
        });

        for (const question of optionQuestions) {
            const correct = Utility.parseCorrectOptions(question.answer);
            const separator = question.questionNum.startsWith("f") ? /\n\w\.\s/g : /\n\(\w\) /g;
            const optionCount = question.question.split(separator).length - 1;

            expect(correct.length).toBeGreaterThan(0);

            for (const option of correct) {
                expect(Utility.getIndexOfOptionBasedOnCharacter(option)).toBeLessThan(optionCount);
            }
        }
    });
});

describe("externalSolutions", () => {
    it("points at questions that exist", () => {
        const ids = new Set(math.concat(physics).map((q) => q.questionNum));
        const dangling = externalSolutions.map((s) => s.questionNum).filter((id) => !ids.has(id));

        expect(dangling).toEqual([]);
    });

    it("has at least one link per entry", () => {
        for (const entry of externalSolutions) {
            expect(entry.links.length).toBeGreaterThan(0);
        }
    });
});
