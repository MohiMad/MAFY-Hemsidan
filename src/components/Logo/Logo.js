import React from "react";
import "./Logo.css";
import {NavLink} from "react-router-dom";


function Logo() {
  return <span className="logo"><NavLink to="">MAFY</NavLink></span>;
}

export default Logo;
