import React from "react";
import "./FilterYears.css";
import {NavLink} from "react-router-dom";


function FilterYears() {
    return (
        <div className="flex-container">
            <h1>Välj år...</h1>
            <div className="years-container">
                {
                    [...new Array(24).keys()].reverse().map((x) => {
                        const year = x < 10 ? `200${ x }` : `20${ x }`;
                        if(x < 7 || x === 20) return void (0);
                        return <NavLink key={year} className="year-nav-link" to={`./${ year }/1`}>{year}</NavLink>;
                    })
                }
            </div>
        </div>);
}

export default FilterYears;
