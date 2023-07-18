import React, {useState} from "react";
import "./QuestionSection.css";
import OptionQuestion from "../OptionQuestion/OptionQuestion";
import AnswerQuestion from "../AnswerQuestion/AnswerQuestion";
import DelCQuestion from "../DelCQuestion/DelCQuestion";
import DisplaySuggestedSolutions from "../DisplaySuggestedSolutions/DisplaySuggestedSolutions";

function Question(props) {
  if(props.isFysik) {
    if(props.questionNum <= 12) return (<OptionQuestion {...props} />);
    else if(props.questionNum !== 19) return (<AnswerQuestion {...props} />);
    else return <DelCQuestion {...props} />;
  }
  if(props.questionNum <= 19) return (<OptionQuestion {...props} />);
  else if(props.questionNum !== 30) return (<AnswerQuestion {...props} />);
  else return <DelCQuestion {...props} />;
}

function QuestionSection({questions, questionNum, isFysik}) {
  const [shouldDisplaySecondayButtons, setShouldDisplaySecondayButtons] = useState(false);

  const props = {questions, questionNum, shouldDisplaySecondayButtons, setShouldDisplaySecondayButtons, isFysik};

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
