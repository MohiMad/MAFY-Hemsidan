import React from "react";
import {NavLink} from "react-router-dom";
import './FirstFilter.css';

function FirstFilter({isMath}) {
  return (
    <div className="main-divider">
      <h1>Filtrera frågor efter...</h1>
      <div className="filterers-div">
        <NavLink to={`/${ isMath ? "matematik" : "fysik" }/år`} className="year">
          <div className="img"></div>
          <span>År...</span>
        </NavLink>

        <NavLink to={`/${ isMath ? "matematik" : "fysik" }/ämne`} className={isMath ? "math" : "fysik"}>
          <div className="img"></div>
          <span>Ämne...</span>
        </NavLink>
      </div>
    </div>

  );
}

export default FirstFilter;
