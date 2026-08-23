import Utility from "../Utility";

const jsonResponse = (body, ok = true) => ({
    ok,
    json: async () => body
});

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    delete global.fetch;
});

describe("fetchYear", () => {
    it("requests the matematik endpoint", async () => {
        global.fetch.mockResolvedValue(jsonResponse([{questionNum: "2019-1"}]));

        await Utility.fetchYear("2019", false);

        expect(global.fetch).toHaveBeenCalledWith("/api/math/year/2019");
    });

    it("requests the fysik endpoint", async () => {
        global.fetch.mockResolvedValue(jsonResponse([{questionNum: "f2019-1"}]));

        await Utility.fetchYear("2019", true);

        expect(global.fetch).toHaveBeenCalledWith("/api/physics/year/2019");
    });

    it("returns the question list", async () => {
        const questions = [{questionNum: "2019-1"}, {questionNum: "2019-2"}];
        global.fetch.mockResolvedValue(jsonResponse(questions));

        await expect(Utility.fetchYear("2019", false)).resolves.toEqual(questions);
    });

    it("ignores a not-found payload instead of passing it off as questions", async () => {
        // The route answers {code: 404} with HTTP 200. Only code 400 was filtered,
        // so the error object was assigned into the question list and the page
        // crashed on questions.map().
        global.fetch.mockResolvedValue(jsonResponse({code: 404, msg: "Not found"}));

        await expect(Utility.fetchYear("2020", false)).resolves.toBeUndefined();
    });

    it("ignores any other non-list payload", async () => {
        for (const body of [{code: 400}, {}, "text", null, 0]) {
            global.fetch.mockResolvedValue(jsonResponse(body));

            await expect(Utility.fetchYear("2019", false)).resolves.toBeUndefined();
        }
    });

    it("returns nothing on an http error", async () => {
        global.fetch.mockResolvedValue(jsonResponse([{questionNum: "2019-1"}], false));

        await expect(Utility.fetchYear("2019", false)).resolves.toBeUndefined();
    });

    it("returns nothing when the request throws", async () => {
        global.fetch.mockRejectedValue(new Error("offline"));

        await expect(Utility.fetchYear("2019", false)).resolves.toBeUndefined();
    });
});

describe("fetchTopic", () => {
    it("requests the topic endpoint for each subject", async () => {
        global.fetch.mockResolvedValue(jsonResponse([]));

        await Utility.fetchTopic("algebra", false);
        expect(global.fetch).toHaveBeenCalledWith("/api/math/topic/algebra");

        await Utility.fetchTopic("algebra", true);
        expect(global.fetch).toHaveBeenCalledWith("/api/physics/topic/algebra");
    });

    it("returns the question list", async () => {
        const questions = [{questionNum: "2019-1"}];
        global.fetch.mockResolvedValue(jsonResponse(questions));

        await expect(Utility.fetchTopic("algebra", false)).resolves.toEqual(questions);
    });

    it("ignores a not-found payload", async () => {
        global.fetch.mockResolvedValue(jsonResponse({code: 404, msg: "Not found"}));

        await expect(Utility.fetchTopic("finns-inte", false)).resolves.toBeUndefined();
    });

    it("returns nothing when the request throws", async () => {
        global.fetch.mockRejectedValue(new Error("offline"));

        await expect(Utility.fetchTopic("algebra", false)).resolves.toBeUndefined();
    });
});

describe("getUserData", () => {
    it("returns the signed-in user", async () => {
        const user = {ID: "1", name: "Test"};
        global.fetch.mockResolvedValue(jsonResponse(user));

        await expect(Utility.getUserData()).resolves.toEqual(user);
    });

    it("returns nothing when nobody is signed in", async () => {
        global.fetch.mockResolvedValue(jsonResponse({msg: "No user found.", code: 400}));

        await expect(Utility.getUserData()).resolves.toBeUndefined();
    });

    it("returns nothing when the request throws", async () => {
        global.fetch.mockRejectedValue(new Error("offline"));

        await expect(Utility.getUserData()).resolves.toBeUndefined();
    });
});

describe("setQuestionCorrectness", () => {
    it("posts the result as query parameters", async () => {
        global.fetch.mockResolvedValue(jsonResponse({code: 200}));

        await Utility.setQuestionCorrectness("2019-1", true);

        const [url, options] = global.fetch.mock.calls[0];

        expect(url).toBe("/api/user/update/correct?qNum=2019-1&isCorrect=true");
        expect(options.method).toBe("POST");
    });

    it("does not throw when the request fails", async () => {
        global.fetch.mockRejectedValue(new Error("offline"));

        await expect(Utility.setQuestionCorrectness("2019-1", true)).resolves.toBeUndefined();
    });
});
