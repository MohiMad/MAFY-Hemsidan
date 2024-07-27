import React from "react";
import "./Logo.css";
import {NavLink} from "react-router-dom";
import Utility from "../../Utility";

function Logo() {
  return <span className="logo" onClick={() => Utility.toTop(window)}><NavLink to="">MAFY</NavLink></span>;
}

export default Logo;
