import Utility from "../Utility";
import math from "../assets/json/math.json";
import physics from "../assets/json/physics.json";

// keywords[0] drives the piechart, so it is restricted to a curated set of broad
// categories. Previously it was free-form, and a grouping heuristic merged the long
// tail at render time — which put 27.6% of the fysik questions in an "annat" slice.
// These lists are the contract: adding a category here is a deliberate decision.
const MATH_CATEGORIES = [
    "algebra och förenkling",
    "potenser och rötter",
    "logaritmer och exponentialfunktioner",
    "ekvationer",
    "olikheter och absolutbelopp",
    "polynom",
    "trigonometri",
    "geometri",
    "derivator och integraler",
    "funktioner",
    "talföljder och serier",
    "talteori och kombinatorik"
];

const PHYSICS_CATEGORIES = [
    "kinematik",
    "krafter och jämvikt",
    "energi och arbete",
    "rörelsemängd och stötar",
    "gravitation och astrofysik",
    "tryck och fluider",
    "termofysik",
    "ellära",
    "elektromagnetism",
    "vågor och optik",
    "relativitetsteori",
    "atom- och kärnfysik",
    "vetenskaplig metod och uppskattning"
];

describe.each([
    ["matematik", math, MATH_CATEGORIES, true],
    ["fysik", physics, PHYSICS_CATEGORIES, false]
])("%s keywords", (name, data, categories, isMath) => {
    it("tags every question", () => {
        expect(data.filter((q) => !q.keywords || q.keywords.length === 0)).toEqual([]);
    });

    it("uses only the curated categories for keywords[0]", () => {
        const offenders = data
            .filter((q) => !categories.includes(q.keywords[0]))
            .map((q) => `${q.questionNum}: ${q.keywords[0]}`);

        expect(offenders).toEqual([]);
    });

    it("has no 'annat' catch-all", () => {
        expect(categories).not.toContain("annat");
        expect(data.filter((q) => q.keywords.includes("annat"))).toEqual([]);
    });

    it("gives every question at least one specific keyword after the category", () => {
        const thin = data.filter((q) => q.keywords.length < 2).map((q) => q.questionNum);

        expect(thin).toEqual([]);
    });

    it("keeps keywords lowercase, trimmed and free of mojibake", () => {
        for (const q of data) {
            for (const keyword of q.keywords) {
                expect(typeof keyword).toBe("string");
                expect(keyword).toBe(keyword.toLowerCase());
                expect(keyword).toBe(keyword.trim());
                // "hÃ¶jder" instead of "höjder" — UTF-8 read as Latin-1.
                expect(keyword).not.toMatch(/[ÃÂ]|�/);
            }
        }
    });

    it("does not repeat a keyword within one question", () => {
        const dupes = data
            .filter((q) => new Set(q.keywords).size !== q.keywords.length)
            .map((q) => q.questionNum);

        expect(dupes).toEqual([]);
    });

    describe("piechart", () => {
        const slices = Utility.getNumberedKeywords(isMath);

        it("has one slice per category in use, and nothing outside the curated set", () => {
            expect([...slices.keys()].every((k) => categories.includes(k))).toBe(true);
            expect(slices.size).toBeLessThanOrEqual(categories.length);
        });

        it("accounts for every question exactly once", () => {
            const total = [...slices.values()].reduce((sum, count) => sum + count, 0);

            expect(total).toBe(data.length);
        });

        it("is ordered largest slice first", () => {
            const counts = [...slices.values()];

            expect(counts).toEqual([...counts].sort((a, b) => b - a));
        });

        it("has no slice large enough to swamp the chart", () => {
            // The old fysik chart had "annat" at 27.6%, bigger than any real topic.
            const oversized = [...slices.entries()]
                .filter(([, count]) => count / data.length > 0.25)
                .map(([k, count]) => `${k}: ${((count / data.length) * 100).toFixed(1)}%`);

            expect(oversized).toEqual([]);
        });

        it("keeps the number of slices readable", () => {
            expect(slices.size).toBeGreaterThanOrEqual(8);
            expect(slices.size).toBeLessThanOrEqual(14);
        });
    });

    describe("topic filtering", () => {
        it("resolves every category offered by the filter page", () => {
            const topics = Array.from(Utility.getNumberedKeywords(isMath).keys());

            expect(topics.length).toBeGreaterThan(0);

            for (const topic of topics) {
                const questions = Utility.getTopicQuestions(topic, !isMath);

                expect(questions.length).toBeGreaterThan(0);
                expect(questions.every((q) => q.keywords[0] === topic)).toBe(true);
            }
        });

        it("partitions the questions — every question reachable from exactly one topic", () => {
            const topics = Array.from(Utility.getNumberedKeywords(isMath).keys());
            const seen = new Map();

            for (const topic of topics) {
                for (const q of Utility.getTopicQuestions(topic, !isMath)) {
                    seen.set(q.questionNum, (seen.get(q.questionNum) || 0) + 1);
                }
            }

            expect(seen.size).toBe(data.length);
            expect([...seen.values()].every((n) => n === 1)).toBe(true);
        });
    });
});

describe("category vocabulary", () => {
    it("does not reuse a category name between the two subjects", () => {
        // The subjects have separate charts; a shared name would be confusing.
        const shared = MATH_CATEGORIES.filter((c) => PHYSICS_CATEGORIES.includes(c));

        expect(shared).toEqual([]);
    });

    it("reuses subtopic keywords rather than inventing one per question", () => {
        // A vocabulary of almost-unique tags would make the secondary keywords useless
        // for finding related questions.
        for (const data of [math, physics]) {
            const subtopics = data.flatMap((q) => q.keywords.slice(1));
            const distinct = new Set(subtopics);

            expect(distinct.size).toBeLessThan(subtopics.length * 0.75);
        }
    });
});
