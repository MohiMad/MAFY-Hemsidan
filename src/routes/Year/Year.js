import React, {useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Utility from "../../Utility";
import YearQuestionPage from "../../components/QuestionPages/YearQuestionPage";

function Year({user, isFysik}) {
  const {year, qNum} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if the year param is not 2023-2007 (excluding 2020), go to not found
    if(!Utility.REGEX.ALL_MATEMATIK_YEARS.test(year)) {
      return navigate("/notfound");
    }

    if(qNum) {
      if(!Utility.qNumWithinRange(qNum, isFysik)) {
        navigate("/notfound");
      }
    } else {
      navigate("./" + 1);
    }
  }, [year, navigate, qNum, isFysik]);

  return <YearQuestionPage user={user} isFysik={isFysik} year={year} />;
}

export default Year;
