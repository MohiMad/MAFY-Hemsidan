import math from "./assets/json/math.json";
import physics from "./assets/json/physics.json";


async function postData(url = "", data = {}) {
  try {
    // Default options are marked with *
    const response = await fetch(url + "?" + new URLSearchParams(data), {
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


const Utility = {
  REGEX: {
    ALL_MATEMATIK_YEARS: /^(20(23|22|21|19|18|17|16|15|14|13|12|11|10|09|08|07))$/,
    MATEMATIK_QUESTION: /(\b([1-9]|1\d|2[0-9]|30)\b)|c/i,
  },
  getYearQuestions(year, isFysik) {
    return (isFysik ? physics : math).filter((x) => x.questionNum.includes(year));
  },

  getQuestionCharacterBasedOnNumber(number) {
    return `(${ ["a", "b", "c", "d", "e", "f", "g", "h"][number] })`;
  },
  getIndexOfOptionBasedOnCharacter(c) {
    return ["a", "b", "c", "d", "e", "f", "g", "h"].indexOf(c) || null;
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

        if(!yearData || yearData.code === 400) return;

        return yearData;
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
  }
};

export default Utility;
