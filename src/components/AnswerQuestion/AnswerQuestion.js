import React, {useState, useEffect, useRef} from "react";
import Button from "../Button/Button";
import NextQuestionButton from "../NextQuestionButton";
import "./AnswerQuestion.css";
import {useLocation} from "react-router-dom";
import Utility from "../../Utility";
import FormattedLatex from "../FormattedLatex";


function AnswerQuestion({questions, questionNum, setShouldDisplaySecondayButtons}) {
  const location = useLocation();
  const [isCorrect, setIsCorrect] = useState("");
  const answerInputRef = useRef();

  const resetAll = () => {
    answerInputRef.current.classList.remove("correct");
    answerInputRef.current.classList.remove("wrong");
    answerInputRef.current.value = "";
    setIsCorrect("");
    setShouldDisplaySecondayButtons(false);
  };

  useEffect(resetAll, [location, setShouldDisplaySecondayButtons]);

  const checkAnswerBtnClicked = async () => {
    const questionAnchor = document.querySelector(`.questions-list a.active`);

    const isAnswerCorrect = answerInputRef.current.value === questions[questionNum].answer;

    if(isAnswerCorrect) {
      answerInputRef.current.classList.add("correct");
      questionAnchor.classList.add("correct");
      questionAnchor.classList.remove("wrong");
    } else if(answerInputRef.current.value !== "") {
      answerInputRef.current.classList.add("wrong");
      questionAnchor.classList.add("wrong");
      questionAnchor.classList.remove("correct");
    }

    setIsCorrect(isAnswerCorrect);
    questions[questionNum].isCorrect = isAnswerCorrect;
    await Utility.setQuestionCorrectness(questions[questionNum].questionNum, isAnswerCorrect);
  };

  const isAnswerCorrectBtnClicked = async (isUserAnswerCorrect) => {
    const questionAnchor = document.querySelector(`.questions-list a.active`);

    answerInputRef.current.classList.remove("correct");
    answerInputRef.current.classList.remove("wrong");
    questionAnchor.classList.remove("correct");
    questionAnchor.classList.remove("wrong");

    answerInputRef.current.classList.add(isUserAnswerCorrect ? "correct" : "wrong");
    questionAnchor.classList.add(isUserAnswerCorrect ? "correct" : "wrong");

    setIsCorrect(isUserAnswerCorrect ? true : "correct");
    questions[questionNum].isCorrect = isUserAnswerCorrect;
    setShouldDisplaySecondayButtons(true);
    await Utility.setQuestionCorrectness(questions[questionNum].questionNum, isUserAnswerCorrect);
  };

  console.log(questions[questionNum].answer);

  return (
    <>
      <FormattedLatex displayMode={false}>{questions[questionNum].question}</FormattedLatex>
      <div className="user-input-container">
        {
          (isCorrect !== "") && (
            <>
              <span>Rätt svar är: </span>
              <FormattedLatex displayMode={false}>{questions[questionNum].answer}</FormattedLatex>
            </>
          )
        }
        <span>{(isCorrect === "" || isCorrect === "correct") ? "" : isCorrect ? "Du svarade rätt!" : "Svarade du rätt?"}</span>
        <input
          ref={answerInputRef}
          type="text"
          name="answer"
          id="answer"
          placeholder="Ange ditt svar..."
        />
      </div>
      {isCorrect === "" ? (
        <Button className="check-answer-btn" onClick={checkAnswerBtnClicked}>
          Svar
        </Button>
      ) : (isCorrect || isCorrect === "correct") ? (
        (<NextQuestionButton />)
      ) :
        (
          <>
            <Button className="check-answer-btn correct" onClick={() => isAnswerCorrectBtnClicked(true)}>
              Ja
            </Button>
            <Button className="check-answer-btn wrong" onClick={() => isAnswerCorrectBtnClicked(false)}>
              Nej
            </Button>
          </>
        )}

    </>
  );
}

export default AnswerQuestion;
