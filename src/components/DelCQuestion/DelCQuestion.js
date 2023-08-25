import React, {useState} from "react";
import Button from "../Button/Button";
import {useNavigate} from "react-router-dom";
import FormattedLatex from "../FormattedLatex";


function DelCQuestion({questions, questionNum, setShouldDisplaySecondayButtons, isFysik}) {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);

    const btnClicked = () => {
        if(isClicked) {
            navigate(`/${ isFysik ? "fysik" : "matematik" }/år`);
            return;
        }

        setShouldDisplaySecondayButtons(true);
        setIsClicked((x) => !x);
    };

    return (
        <>
            <FormattedLatex>{questions[questionNum].question}</FormattedLatex>
            <div className="user-input-container">
                {isClicked && (
                    <FormattedLatex>{questions[questionNum].answer}</FormattedLatex>
                )}
            </div>
            <Button className="check-answer-btn" onClick={btnClicked}>{isClicked ? "Avsluta" : "Visa svar"}</Button>
        </>
    );
}

export default DelCQuestion;
