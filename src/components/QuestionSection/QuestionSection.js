import React, {useState} from "react";
import "./QuestionSection.css";
import OptionQuestion from "../OptionQuestion/OptionQuestion";
import AnswerQuestion from "../AnswerQuestion/AnswerQuestion";
import DelCQuestion from "../DelCQuestion/DelCQuestion";
import DisplaySuggestedSolutions from "../DisplaySuggestedSolutions/DisplaySuggestedSolutions";

function Question(props) {
  // Logging to see the values
  console.log("Question props:", props);

  const question = props.questions[props.questionNum];

  // Check if question exists
  if(!question) {
    return <div>Frågan hittades ej!</div>;
  }

  const number = Number(question.questionNum.split("-")[1]) || 31;

  if(props.isFysik) {
    if(number <= 13) return (<OptionQuestion {...props} />);
    else if(number !== 20) return (<AnswerQuestion {...props} />);
    else return <DelCQuestion {...props} />;
  } else {
    if(number <= 20) return (<OptionQuestion {...props} />);
    else if(number !== 31) return (<AnswerQuestion {...props} />);
    else return <DelCQuestion {...props} />;
  }
}

function QuestionSection({user, questions, questionNum, isFysik}) {
  const [shouldDisplaySecondayButtons, setShouldDisplaySecondaryButtons] = useState(false);

  const props = {user, questions, questionNum, shouldDisplaySecondayButtons, setShouldDisplaySecondaryButtons, isFysik};

  return (
    <div className="question-section-holder">
      <div className="question-holder">
        <Question {...props} />
        <DisplaySuggestedSolutions {...props} />
      </div>
    </div>
  );
}

export default QuestionSection;
