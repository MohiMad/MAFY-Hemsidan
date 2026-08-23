import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Utility from "../../Utility";
import TopicQuestionPage from "../../components/QuestionPages/TopicQuestionPage";

function Topic({user, isFysik}) {
    const {topic, qNum} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // if the topic is not one of the grouped keywords, go to not found
        const numberedKeywords = Utility.getNumberedKeywords(!isFysik);
        const keywords = numberedKeywords ? Array.from(numberedKeywords.keys()).map(x => x.toLowerCase()) : [];
        const topicQuestions = Utility.getTopicQuestions(topic, isFysik);

        // topicQuestions[0] was read without checking that the topic has any
        // questions, which threw instead of showing the not-found page.
        if(!keywords.includes(topic.toLowerCase()) || !topicQuestions.length) {
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
