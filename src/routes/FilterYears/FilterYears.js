import React from "react";
import "./FilterYears.css";
import {NavLink, useLocation} from "react-router-dom";
import Utility from "../../Utility";



function FilterYears() {
    // The list used to be generated from a hard-coded 2000-2024 range with the
    // years that were never held filtered out by index, so a new exam was not
    // reachable until that range was widened. It now follows the question data.
    const isFysik = useLocation().pathname.startsWith("/fysik");
    const years = Utility.getAvailableYears(isFysik);

    return (
        <div className="flex-container">
            <h1>Välj år...</h1>
            <div className="years-container">
                {
                    years.map((year) => (
                        <NavLink key={year} className="year-nav-link" to={`./${ year }/1`}>{year}</NavLink>
                    ))
                }
            </div>
        </div>);
}

export default FilterYears;
