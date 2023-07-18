import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import Button from "./Button/Button";

function NextQuestionButton(props) {
    const {qNum} = useParams();
    const navigate = useNavigate();

    const nextQuestionBtn = () => {
        navigate(`../${ Number(qNum) === 30 ? "C" : (Number(qNum) || 1) + 1 }`);
    };

    return (qNum?.toLowerCase() !== "c") && <Button className="check-answer-btn" onClick={nextQuestionBtn}>
        Nästa fråga
    </Button>;
}

export default NextQuestionButton;
