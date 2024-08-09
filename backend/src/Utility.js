const url = require("url");
const CryptoJS = require("crypto-js");
const User = require("../models/User.model.js");
const math = require("../public/json/math.json");
const physics = require("../public/json/physics.json");

const STATUS_CODES = {
    NOT_FOUND: {
        code: 404,
        msg: "Not found"
    },
    OK: {
        code: 200,
        msg: "ok"
    },
    FORBIDDEN: {
        code: 403,
        msg: "Forbidden"
    }
};

const DISCORD_API_ROUTES = {
    OAUTH2_TOKEN: "https://discord.com/api/oauth2/token",
    USER: "https://discord.com/api/users/@me",
    OAUTH2_TOKEN_REVOKE: "https://discord.com/api/v8/oauth2/token/revoke"
};

function buildOAuth2RequestPayload(data) {
    return new url.URLSearchParams(data).toString();
}

function encryptTokens(accessToken, refreshToken) {
    return {
        accessToken: encryptToken(accessToken).toString(),
        refreshToken: encryptToken(refreshToken).toString(),
    };
}


function encryptToken(token) {
    return CryptoJS.AES.encrypt(token, process.env.ENCRYPT_SECRET);
}

function decryptToken(encrypted) {
    return CryptoJS.AES.decrypt(encrypted, process.env.ENCRYPT_SECRET);
}

async function createUser({id, username, avatar, global_name}, accessToken, refreshToken) {
    const user = await User.findOne({ID: id});

    if(user) {
        const updatedUser = updateUser(user, {id, username, avatar, global_name, accessToken, refreshToken});

        return updatedUser;
    }

    const newUser = new User({
        ID: id,
        username: username,
        name: global_name || username,
        avatar: avatar,
        accessToken: accessToken,
        refreshToken: refreshToken,
        correct: [],
        wrong: []
    });

    await newUser.save().catch(err => console.log(err));

    return newUser;
}

async function getUser(id) {
    return User.findOne({ID: id});
}

async function updateUser(user, {id, username, avatar, global_name, accessToken, refreshToken}) {
    user.ID = id;
    user.username = username;
    user.name = global_name || username;
    user.avatar = avatar;
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save().catch(err => console.log(err));

    return user;
}

async function mergeData(data, user) {
    if(user) {
        const userData = await getUser(user.ID);

        return data.map(q => {
            const qNum = q.questionNum.toUpperCase();
            if(userData.correct.includes(qNum) || userData.wrong.includes(qNum)) {
                return {...q, isCorrect: userData.correct.includes(qNum)};
            }

            return q;
        });
    }

    return data;
}

function return404Status(res) {
    return res.json(STATUS_CODES.NOT_FOUND);
}

function correctQuestionNumberFormat(qNum) {
    return /^f?20(24|23|22|21|19|18|17|16|15|14|13|12|11|10|09|08|07)-([1-9]|[1-2][0-9]|30|C)$/i.test(qNum);
}

function sendMsg(res, msg, code) {
    return res.json({msg, code});
}

async function getUsersForSolutions(solutionDoc) {
    const questionSolutionsWithUserInfo = solutionDoc.solutions.map(async (solution) => {
        const user = await getUser(solution.ID);

        if(user) {
            solution.name = user.name || user.username;
            solution.avatar = user.avatar;
        } else {
            solution.name = "Borttagen användare";
        }

        return solution;
    });

    solutionDoc.solutions = await Promise.all(questionSolutionsWithUserInfo);

    return solutionDoc;
}

function getNumberedKeywords(questions, isGetAnnat = false) {
    try {
        const keywordCounts = new Map();

        questions.forEach(question => {
            if(keywordCounts.has(question.keywords[0].toLowerCase())) {
                keywordCounts.set(question.keywords[0].toLowerCase(), keywordCounts.get(question.keywords[0].toLowerCase()) + 1);
            } else {
                keywordCounts.set(question.keywords[0].toLowerCase(), 1);
            }
        });

        function findRelatedKeyword(keyword, map) {
            const root = keyword.split(' ')[0];
            for(let [key] of map.entries()) {
                if(key.includes(root) && keyword !== key) {
                    return key;
                }
            }
            return null;
        }

        const threshold = 5;
        const groupedKeywords = new Map();
        const others = [];

        keywordCounts.forEach((count, keyword) => {
            if(count >= threshold) {
                groupedKeywords.set(keyword, count);
            } else {
                const related = findRelatedKeyword(keyword, groupedKeywords);
                if(related) {
                    groupedKeywords.set(related, groupedKeywords.get(related) + count);
                } else {
                    others.push(keyword.toLowerCase());
                }
            }
        });

        if(others.length > 0) {
            groupedKeywords.set('annat', others.reduce((sum, keyword) => sum + keywordCounts.get(keyword), 0));
        }

        return isGetAnnat ? others : groupedKeywords;

    } catch(parseError) {
        console.error("An error occurred while parsing JSON data:", parseError);
    }

}

async function getMergedTopicQuestions(data, user, topic) {
    let topicQuestions;

    if(topic === "annat") {
        topicQuestions = data.filter((x) => getNumberedKeywords(data, true).includes(x.keywords[0].toLowerCase()));
    } else {
        topicQuestions = data.filter(x => x.keywords[0].toLowerCase() == topic.toLowerCase());
    }

    if(!topicQuestions) {
        return;
    }

    return await mergeData(topicQuestions, user);

}

function getStaticSolution(questionNum) {
    const data = questionNum.toLowerCase().startsWith("f") ? physics : math;

    const solution = data.find(x => x.questionNum === questionNum.toLowerCase())?.solution;

    const staticSolutionObject = {
        name: "ChatGPT",
        solution: solution,
        type: "latex"
    };

    return solution ? staticSolutionObject : null;
}


module.exports.STATUS_CODES = STATUS_CODES;
module.exports.DISCORD_API_ROUTES = DISCORD_API_ROUTES;
module.exports.buildOAuth2RequestPayload = buildOAuth2RequestPayload;
module.exports.encryptTokens = encryptTokens;
module.exports.decryptToken = decryptToken;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.createUser = createUser;
module.exports.mergeData = mergeData;
module.exports.return404Status = return404Status;
module.exports.correctQuestionNumberFormat = correctQuestionNumberFormat;
module.exports.sendMsg = sendMsg;
module.exports.getUsersForSolutions = getUsersForSolutions;
module.exports.getMergedTopicQuestions = getMergedTopicQuestions;
module.exports.getStaticSolution = getStaticSolution;