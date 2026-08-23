import math from "./assets/json/math.json";
import physics from "./assets/json/physics.json";


async function postData(url = "", data) {
  try {
    // Default options are marked with *
    const response = await fetch(data ? (url + "?" + new URLSearchParams(data)) : url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer" // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).catch(e => void (0));
    if(response.ok) {
      return response.json(); // parses JSON response into native JavaScript objects
    }
  }
  catch(e) {
    return;
  }
}


const OPTION_CHARACTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];

// The topic a question is filed under. Untagged questions (keywords: []) have none.
function firstKeyword(question) {
  const keyword = question.keywords?.[0];

  return keyword ? keyword.toLowerCase() : null;
}

const Utility = {
  REGEX: {
    ALL_MATEMATIK_YEARS: /^(20(26|25|24|23|22|21|19|18|17|16|15|14|13|12|11|10|09|08|07))$/,
    MATEMATIK_QUESTION: /(\b([1-9]|1\d|2[0-9]|30)\b)|c/i,
  },
  // Match on the year part of the questionNum ("2019-12" / "f2019-12") rather
  // than a substring search, so a year can never pull in another year's questions.
  getYearQuestions(year, isFysik) {
    if(!/^\d{4}$/.test(String(year))) return [];

    return (isFysik ? physics : math).filter((x) => x.questionNum.replace(/^f/i, "").split("-")[0] === String(year));
  },
  // The years that actually have questions, newest first. Derived from the data so
  // adding an exam does not also mean editing a hard-coded year range.
  getAvailableYears(isFysik) {
    const years = (isFysik ? physics : math).map((x) => x.questionNum.replace(/^f/i, "").split("-")[0]);

    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  },
  getTopicQuestions(topic, isFysik) {
    // keywords[0] is one of a curated set of broad categories, so a topic is just
    // that category. There is no longer an "annat" catch-all to expand.
    return (isFysik ? physics : math).filter((x) => firstKeyword(x) === topic.toLowerCase());
  },
  getQuestionCharacterBasedOnNumber(number) {
    return `(${ OPTION_CHARACTERS[number] })`;
  },
  getIndexOfOptionBasedOnCharacter(c) {
    const index = OPTION_CHARACTERS.indexOf(String(c).toLowerCase());

    return index === -1 ? null : index;
  },
  // Turns an answer field into the option letters it actually refers to.
  // "b" -> ["b"], "A,B,C" -> ["a","b","c"], and prose such as
  // "d, rätt ges även för 9a" -> ["d"] (the trailing note is not an option).
  parseCorrectOptions(answer) {
    return String(answer ?? "")
      .toLowerCase()
      .split(",")
      .map((part) => part.trim())
      .filter((part) => OPTION_CHARACTERS.includes(part));
  },
  uniqueKey(pre) {
    return `${ pre }_${ new Date().getTime() }`;
  },
  async getUserData() {
    try {
      const res = await fetch("/api/user/data");
      const user = await res.json();

      if(!user || user.code === 400) return;

      return user;
    } catch(e) {
      return;
    }
  },
  async fetchYear(year, isFysik) {
    try {
      const res = await fetch(`/api/${ isFysik ? "physics" : "math" }/year/${ year }`);
      if(res.ok) {
        const yearData = await res.json();

        // These endpoints answer with a {code, msg} object on failure. Only a list
        // of questions is usable here; anything else was previously rendered as
        // the question list and crashed on .map().
        if(!Array.isArray(yearData)) return;

        return yearData;
      }
    } catch(e) {
      return;
    }
  },
  async fetchTopic(topic, isFysik) {
    try {
      const res = await fetch(`/api/${ isFysik ? "physics" : "math" }/topic/${ topic }`);
      if(res.ok) {
        const topicData = await res.json();

        if(!Array.isArray(topicData)) return;

        return topicData;
      }
    } catch(e) {
      return;
    }
  },
  async setQuestionCorrectness(qNum, isCorrect) {
    await postData("/api/user/update/correct", {qNum, isCorrect});
  },
  async get(url) {
    if(!url) return;
    const res = await fetch(url);
    if(!res.ok) return;
    const data = await res.json();
    if(!data) return;

    return data;
  },
  qNumWithinRange(qNum, isFysik) {
    return (Number(qNum) ? isFysik ? qNum >= 1 && qNum <= 20 : qNum >= 1 && qNum <= 30 : isFysik ? false : qNum.toUpperCase() === "C");
  },
  setDocumentTitleTo(document, title) {
    document.title = title;
  },
  postData,
  // Counts the questions per broad category, largest first — the piechart slices.
  //
  // keywords[0] is now drawn from a curated set of ~12 broad categories, so this is
  // a plain tally. It used to merge any keyword with fewer than five questions into
  // whichever category shared its first word, and dump the rest into "annat" — with
  // the old free-form tags that made "annat" the largest fysik slice at 27.6%.
  getNumberedKeywords(isMath = false) {
    const questions = isMath ? math : physics;
    const counts = new Map();

    questions.forEach(question => {
      // Untagged questions (keywords: []) are not counted under any category.
      const keyword = firstKeyword(question);
      if(!keyword) return;

      counts.set(keyword, (counts.get(keyword) || 0) + 1);
    });

    return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
  },
  getRandomDarkColor: () => {
    const lum = -0.5; // Luminosity factor; adjust for darker or lighter
    let hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(0, 7);
    let rgb = '', c, i;
    for(i = 0;i < 3;i++) {
      c = parseInt(hex.substr(1 + 2 * i, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }
    return '#' + rgb;
  },
  toTop: (window) => {
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
  }
};

export default Utility;
