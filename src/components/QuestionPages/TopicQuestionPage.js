import React, {useState, useEffect, useRef} from "react";
import {NavLink, useParams, useNavigate} from "react-router-dom";
import Utility from "../../Utility";
import QuestionSection from "../QuestionSection/QuestionSection";
import "./QuestionPage.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';

function TopicQuestionPage({user, topic, isFysik}) {
  const [questions, setQuestions] = useState(Utility.getTopicQuestions(topic, isFysik));
  const qContainerRef = useRef();

  useEffect(() => {
    (async () => {
      const userTopicQuestions = (await Utility.fetchTopic(topic, isFysik));
      if(!userTopicQuestions) return;

      setQuestions(userTopicQuestions);
    })();
  }, [topic, isFysik]);


  const {qNum} = useParams();
  const navigate = useNavigate();
  const [questionNum, setQuestionNum] = useState(0);

  useEffect(() => {
    if(qNum) setQuestionNum(questions.indexOf(questions.find(x => x.questionNum === qNum)));
  }, [qNum, questions, navigate]);

  return (
    <div ref={qContainerRef} className="panel-and-question-divider">
      <div className="burger" onClick={() => qContainerRef.current.classList.toggle("toggle")}>
        <FontAwesomeIcon className="arrow" icon={faAngleLeft} />
      </div>
      <div className="questions-container">
        <div className="questions-list" >
          {questions.map((q) => (
            <NavLink
              onClick={() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}
              className={q.isCorrect === undefined ? "" : q.isCorrect ? "correct" : "wrong"}
              key={q.questionNum}
              to={`../${ q.questionNum }`}
            >
              {"År " + q.questionNum.replace("f", "").replace("-", " Fråga ")}
            </NavLink>
          ))}
        </div>
      </div>
      <QuestionSection user={user} questions={questions} questionNum={questionNum} isFysik={isFysik} />
    </div>
  );
}

export default TopicQuestionPage;
