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


const Utility = {
  REGEX: {
    ALL_MATEMATIK_YEARS: /^(20(24|23|22|21|19|18|17|16|15|14|13|12|11|10|09|08|07))$/,
    MATEMATIK_QUESTION: /(\b([1-9]|1\d|2[0-9]|30)\b)|c/i,
  },
  getYearQuestions(year, isFysik) {
    return (isFysik ? physics : math).filter((x) => x.questionNum.includes(year));
  },
  getTopicQuestions(topic, isFysik) {
    if(topic === "annat") return (isFysik ? physics : math).filter((x) => this.getNumberedKeywords(!isFysik, true).includes(x.keywords[0].toLowerCase()));
    return (isFysik ? physics : math).filter((x) => x.keywords[0].toLowerCase() === topic.toLowerCase());
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
  async fetchTopic(topic, isFysik) {
    try {
      const res = await fetch(`/api/${ isFysik ? "physics" : "math" }/topic/${ topic }`);
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
  },
  setDocumentTitleTo(document, title) {
    document.title = title;
  },
  postData,
  getNumberedKeywords(isMath = false, isGetAnnat = false) {
    try {
      const questions = isMath ? math : physics;
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
