import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import Button from "./Button/Button";
import Utility from "../../src/Utility";

function NextQuestionButton({questions, questionNum}) {
    const {qNum} = useParams();
    const navigate = useNavigate();
    const nextQuestionNum = questions[questionNum + 1]?.questionNum || 0;

    const nextQuestionBtn = () => {
        if(questionNum === questions.length - 1) {
            navigate("/");
            return Utility.toTop(window);
        }

        navigate(`../${ Number(qNum) ? nextQuestionNum.split("-")[1] : nextQuestionNum }`);
    };

    return (<Button className="check-answer-btn" onClick={nextQuestionBtn}>
        {(questionNum !== questions.length - 1) ? "Nästa fråga" : "Avsluta"}
    </Button>);
}

export default NextQuestionButton;
