import Utility from "../Utility";
import math from "../assets/json/math.json";
import physics from "../assets/json/physics.json";

const MATH_YEARS = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2021, 2022, 2023, 2024, 2025, 2026];

const yearOf = (question) => question.questionNum.replace(/^f/i, "").split("-")[0];

describe("getYearQuestions", () => {
    it.each(MATH_YEARS)("returns only %i's matematik questions", (year) => {
        const questions = Utility.getYearQuestions(String(year), false);

        expect(questions).toHaveLength(31);
        expect(questions.every((q) => yearOf(q) === String(year))).toBe(true);
    });

    it.each(MATH_YEARS)("returns only %i's fysik questions", (year) => {
        const questions = Utility.getYearQuestions(String(year), true);

        expect(questions).toHaveLength(20);
        expect(questions.every((q) => yearOf(q) === String(year))).toBe(true);
    });

    it("does not mix 2019 and 2021 across the missing 2020 exam", () => {
        const numbers = Utility.getYearQuestions("2019", false).map((q) => q.questionNum);

        expect(numbers).toContain("2019-1");
        expect(numbers).not.toContain("2021-1");
    });

    it("matches the year part only, never the question number", () => {
        // A substring search made "1" match "2011-1", "2012-1", "2019-1", ...
        expect(Utility.getYearQuestions("1", false)).toEqual([]);
        expect(Utility.getYearQuestions("19", false)).toEqual([]);
    });

    it("returns nothing for years that were never held or are out of range", () => {
        expect(Utility.getYearQuestions("2020", false)).toEqual([]);
        expect(Utility.getYearQuestions("2006", false)).toEqual([]);
        expect(Utility.getYearQuestions("2027", false)).toEqual([]);
    });

    it.each(["", "abc", "2019-1", null, undefined])("returns nothing for the invalid year %p", (year) => {
        expect(Utility.getYearQuestions(year, false)).toEqual([]);
    });

    it("agrees with the year regex used for routing", () => {
        for (const year of MATH_YEARS) {
            expect(Utility.REGEX.ALL_MATEMATIK_YEARS.test(String(year))).toBe(true);
            expect(Utility.getYearQuestions(String(year), false).length).toBeGreaterThan(0);
        }

        // Anything the router sends to /notfound must also have no questions.
        for (const year of ["2020", "2006", "2027", "1"]) {
            expect(Utility.REGEX.ALL_MATEMATIK_YEARS.test(year)).toBe(false);
            expect(Utility.getYearQuestions(year, false)).toEqual([]);
        }
    });
});

describe("getAvailableYears", () => {
    it("lists the years that have questions, newest first", () => {
        const expected = [...MATH_YEARS].sort((a, b) => b - a).map(String);

        expect(Utility.getAvailableYears(false)).toEqual(expected);
        expect(Utility.getAvailableYears(true)).toEqual(expected);
    });

    it("offers only years that resolve to questions", () => {
        // The year filter page links straight to ./<year>/1, so a listed year that
        // has no questions would send the student to the not-found page.
        for (const isFysik of [false, true]) {
            for (const year of Utility.getAvailableYears(isFysik)) {
                expect(Utility.REGEX.ALL_MATEMATIK_YEARS.test(year)).toBe(true);
                expect(Utility.getYearQuestions(year, isFysik).length).toBeGreaterThan(0);
            }
        }
    });

    it("does not offer 2020", () => {
        expect(Utility.getAvailableYears(false)).not.toContain("2020");
    });
});

describe("parseCorrectOptions", () => {
    it("reads a single answer", () => {
        expect(Utility.parseCorrectOptions("b")).toEqual(["b"]);
    });

    it("lowercases the fysik answers, which are stored uppercase", () => {
        expect(Utility.parseCorrectOptions("E")).toEqual(["e"]);
    });

    it("reads a multi-option answer", () => {
        expect(Utility.parseCorrectOptions("A,B,C")).toEqual(["a", "b", "c"]);
        expect(Utility.parseCorrectOptions("B,D,E,F")).toEqual(["b", "d", "e", "f"]);
    });

    it("ignores the explanatory note some answers carry", () => {
        // math 2016-9 / 2016-10. The note used to be treated as an option id,
        // so highlighting the answer threw on a null element.
        expect(Utility.parseCorrectOptions("d, rätt ges även för 9a")).toEqual(["d"]);
        expect(Utility.parseCorrectOptions("d, rätt ges även för 10b")).toEqual(["d"]);
    });

    it("does not treat a letter inside prose as a selectable option", () => {
        // The old check was answer.includes(letter), so picking (a) on 2016-9 was
        // graded correct because of the "a" in "även".
        expect(Utility.parseCorrectOptions("d, rätt ges även för 9a")).not.toContain("a");
    });

    it("returns nothing for free-text answers", () => {
        expect(Utility.parseCorrectOptions("20m")).toEqual([]);
        expect(Utility.parseCorrectOptions("$u$")).toEqual([]);
        expect(Utility.parseCorrectOptions("3 ")).toEqual([]);
    });

    it.each(["", null, undefined])("returns nothing for %p", (answer) => {
        expect(Utility.parseCorrectOptions(answer)).toEqual([]);
    });

    it("resolves at least one option for every multiple-choice question in the data", () => {
        const unresolved = math.concat(physics)
            .filter((q) => {
                const number = Number(q.questionNum.split("-")[1]);
                return q.questionNum.startsWith("f") ? number <= 13 : number <= 20;
            })
            .filter((q) => Utility.parseCorrectOptions(q.answer).length === 0)
            .map((q) => q.questionNum);

        expect(unresolved).toEqual([]);
    });

    it("only ever yields ids that exist as rendered options", () => {
        const rendered = new Set(
            Array.from({length: 8}, (_, i) => Utility.getQuestionCharacterBasedOnNumber(i).slice(1, -1))
        );

        for (const q of math.concat(physics)) {
            for (const option of Utility.parseCorrectOptions(q.answer)) {
                expect(rendered.has(option)).toBe(true);
            }
        }
    });
});

describe("option characters", () => {
    it("maps an index to a rendered option id", () => {
        expect(Utility.getQuestionCharacterBasedOnNumber(0)).toBe("(a)");
        expect(Utility.getQuestionCharacterBasedOnNumber(4)).toBe("(e)");
    });

    it("maps an option back to its index, including the first one", () => {
        // indexOf(...) || null returned null for "a", because its index is 0.
        expect(Utility.getIndexOfOptionBasedOnCharacter("a")).toBe(0);
        expect(Utility.getIndexOfOptionBasedOnCharacter("b")).toBe(1);
        expect(Utility.getIndexOfOptionBasedOnCharacter("A")).toBe(0);
    });

    it("returns null for something that is not an option", () => {
        expect(Utility.getIndexOfOptionBasedOnCharacter("z")).toBeNull();
        expect(Utility.getIndexOfOptionBasedOnCharacter("")).toBeNull();
    });

    it("round-trips index -> id -> index", () => {
        for (let i = 0; i < 8; i++) {
            const id = Utility.getQuestionCharacterBasedOnNumber(i);

            expect(Utility.getIndexOfOptionBasedOnCharacter(id.slice(1, -1))).toBe(i);
        }
    });
});

describe("qNumWithinRange", () => {
    it("accepts the matematik range and Del C", () => {
        expect(Utility.qNumWithinRange("1", false)).toBe(true);
        expect(Utility.qNumWithinRange("30", false)).toBe(true);
        expect(Utility.qNumWithinRange("C", false)).toBe(true);
        expect(Utility.qNumWithinRange("c", false)).toBe(true);
    });

    it("rejects matematik numbers outside the range", () => {
        expect(Utility.qNumWithinRange("0", false)).toBe(false);
        expect(Utility.qNumWithinRange("31", false)).toBe(false);
        expect(Utility.qNumWithinRange("abc", false)).toBe(false);
    });

    it("accepts the fysik range and rejects Del C, which fysik does not have", () => {
        expect(Utility.qNumWithinRange("1", true)).toBe(true);
        expect(Utility.qNumWithinRange("20", true)).toBe(true);
        expect(Utility.qNumWithinRange("21", true)).toBe(false);
        expect(Utility.qNumWithinRange("C", true)).toBe(false);
    });

    it("accepts every question the year pages link to", () => {
        for (const isFysik of [false, true]) {
            for (const q of Utility.getYearQuestions("2019", isFysik)) {
                expect(Utility.qNumWithinRange(q.questionNum.split("-")[1], isFysik)).toBe(true);
            }
        }
    });
});

describe("getTopicQuestions", () => {
    // The 2025 and 2026 questions are not tagged yet, so a tagged one is picked here.
    const taggedTopic = math.find((q) => q.keywords.length > 0).keywords[0];

    it("returns the questions for a topic", () => {
        const questions = Utility.getTopicQuestions(taggedTopic, false);

        expect(questions.length).toBeGreaterThan(0);
        expect(questions.every((q) => q.keywords[0].toLowerCase() === taggedTopic.toLowerCase())).toBe(true);
    });

    it("is case-insensitive", () => {
        expect(Utility.getTopicQuestions(taggedTopic.toUpperCase(), false))
            .toEqual(Utility.getTopicQuestions(taggedTopic, false));
    });

    it("returns nothing for an unknown topic", () => {
        expect(Utility.getTopicQuestions("finns-inte", false)).toEqual([]);
    });

    it("no longer treats 'annat' as a topic", () => {
        // The grouping heuristic used to invent an "annat" bucket; the curated
        // categories replaced it, so it is now just an unknown topic.
        expect(Utility.getTopicQuestions("annat", false)).toEqual([]);
        expect(Utility.getTopicQuestions("annat", true)).toEqual([]);
    });
});

describe("getNumberedKeywords", () => {
    it("counts matematik and fysik separately", () => {
        const mathKeywords = Utility.getNumberedKeywords(true);
        const physicsKeywords = Utility.getNumberedKeywords(false);

        expect(mathKeywords.size).toBeGreaterThan(0);
        expect(physicsKeywords.size).toBeGreaterThan(0);
        expect(mathKeywords).not.toEqual(physicsKeywords);
    });

    it("accounts for every question exactly once", () => {
        for (const [isMath, data] of [[true, math], [false, physics]]) {
            const total = Array.from(Utility.getNumberedKeywords(isMath).values())
                .reduce((sum, count) => sum + count, 0);

            expect(total).toBe(data.length);
        }
    });

    it("returns a Map for both subjects", () => {
        expect(Utility.getNumberedKeywords(true)).toBeInstanceOf(Map);
        expect(Utility.getNumberedKeywords(false)).toBeInstanceOf(Map);
    });
});
