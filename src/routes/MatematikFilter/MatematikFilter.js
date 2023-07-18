import React from "react";
import {NavLink} from "react-router-dom";
// import './MatematikFilter.css';

function MatematikFilter(props) {
  return (
    <>
      <p>hello math filter</p>
      <NavLink to="/matematik/år">Filtrera efter år</NavLink>
      <br />
      <NavLink to="/matematik/subject">Filtrera efter ämne</NavLink>
      <br />
      <NavLink to="/matematik/del">Filtrera efter del</NavLink>
    </>
  );
}

export default MatematikFilter;
