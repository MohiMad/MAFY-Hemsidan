import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Utility from "../../Utility";
import TopicQuestionPage from "../../components/QuestionPages/TopicQuestionPage";

function Topic({user, isFysik}) {
    const {topic, qNum} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // if the year param is not 2023-2007 (excluding 2020), go to not found
        const keywords = Array.from(Utility.getNumberedKeywords(!isFysik).keys()).map(x => x.toLowerCase());
        const topicQuestions = Utility.getTopicQuestions(topic, isFysik);

        if(!keywords.includes(topic.toLowerCase())) {
            return navigate("/notfound");
        }

        if(qNum) {
            if(!topicQuestions.some(x => x.questionNum === qNum)) {
                navigate("/notfound");
            }
        } else {
            navigate("./" + topicQuestions[0].questionNum);
        }
    }, [topic, navigate, qNum, isFysik]);

    return <TopicQuestionPage user={user} isFysik={isFysik} topic={topic} />;
}

export default Topic;
