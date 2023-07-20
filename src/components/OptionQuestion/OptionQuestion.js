import React, {useState, useEffect} from "react";
import "./OptionQuestion.css";
import Utility from "../../Utility";
import Button from "../Button/Button";
import {useLocation} from "react-router-dom";
import NextQuestionButton from "../NextQuestionButton";
import FormattedLatex from "../FormattedLatex";


function OptionQuestion({questions, questionNum, setShouldDisplaySecondayButtons, isFysik}) {
  const location = useLocation();
  const [selected, setSelected] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const questionAndOptions = questions[questionNum]?.question?.split(isFysik ? /\n\w\.\s/g : /\n\(\w\) /g);

  const resetAll = () => {
    const allCheckboxes = document.querySelectorAll(".option input");
    setSelected("");
    setIsAnswered(false);
    setShouldDisplaySecondayButtons(false);
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement.classList.remove("chosen");
      checkbox.parentElement.classList.remove("correct");
      checkbox.parentElement.classList.remove("wrong");
    });
  };

  useEffect(resetAll, [location, setShouldDisplaySecondayButtons]);

  const optionClicked = (e) => {
    const allCheckboxes = document.querySelectorAll(".option input");

    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      checkbox.parentElement.classList.remove("chosen");
    });

    e.target.children[0].checked = !e.target.children[0].checked;
  };

  const checkAnswerBtnClicked = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const chosenOption = document.getElementById(selected);
    const correctOption = document.getElementById(`(${ questions[questionNum].answer.toLowerCase() })`);
    const questionAnchor = document.querySelector(`.questions-list a.active`);

    if(chosenOption) {
      const isCorrect = selected === `(${ questions[questionNum].answer.toLowerCase() })`;

      questions[questionNum].isCorrect = isCorrect;

      if(isCorrect) {
        chosenOption.classList.add("correct");
        questionAnchor.classList.add("correct");
        questionAnchor.classList.remove("wrong");
      } else {
        chosenOption.classList.add("wrong");
        correctOption.classList.add("correct");

        questionAnchor.classList.add("wrong");
        questionAnchor.classList.remove("correct");
      }

      await Utility.setQuestionCorrectness(questions[questionNum].questionNum, isCorrect);
    } else {
      const options = document.querySelectorAll(".option");

      correctOption.classList.add("correct");
      options.forEach((x) =>
        x.classList.contains("correct") ? null : x.classList.add("wrong")
      );
      questions[questionNum].isCorrect = false;
      await Utility.setQuestionCorrectness(questions[questionNum].questionNum, false);
      questionAnchor.classList.remove("correct");
      questionAnchor.classList.add("wrong");
    }

    setIsAnswered(true);
    setShouldDisplaySecondayButtons(true);
  };

  return (
    <>
      <FormattedLatex>{`${ questionAndOptions?.[0] }${ isFysik ? "" : ":" }`}</FormattedLatex>
      <div className="option-holder">
        {questionAndOptions?.slice(1).map((option, i) => {
          const questionCharacter = Utility.getQuestionCharacterBasedOnNumber(i);

          return (
            <div
              id={questionCharacter}
              className={`option ${ selected === questionCharacter ? "chosen" : "" }`}
              key={option}
              onClick={(e) => {
                if(isAnswered) return;
                setSelected(questionCharacter);
                optionClicked(e);
              }}
            >
              <input
                type="radio"
                name={questionCharacter}
                key={option}
              />
              <FormattedLatex
              >{`${ questionCharacter } ${ option }`}</FormattedLatex>
            </div>
          );
        })}
      </div>
      {isAnswered ? (<NextQuestionButton />) : (
        <Button className="check-answer-btn" onClick={(e) => checkAnswerBtnClicked(e)}>
          Svara
        </Button>
      )}
    </>
  );
}

export default OptionQuestion;
