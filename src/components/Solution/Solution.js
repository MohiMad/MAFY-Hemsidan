import React from "react";
import "./Solution.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';

function Solution({solution}) {
    const openLink = (e) => {
        e.stopPropagation();
        window.open(`https://i.imgur.com/${ solution.solution.split(".com/")[1] }`);
    };

    const displaySolution = (e) => {
        e.stopPropagation();
        if(e.target.parentElement.classList.contains("expand")) {
            return e.target.parentElement.classList.remove("expand");
        }

        document.querySelectorAll(".solution-holder").forEach(elm => {
            if(elm.classList.contains("expand")) {
                elm.classList.remove("expand");
            }
        });
        e.target.parentElement.classList.toggle("expand");
    };

    return <div className="solution-holder" style={{
        backgroundImage: `url(${ solution.solution })`
    }} data-height={solution.height}>
        <div onClick={displaySolution} className="overlay"></div>
        <div className="solution-popover">

        </div>
        <span className="solution-header">{`${ solution.name }s lösning`}</span>
        <div onClick={displaySolution} className="options-container">
            <FontAwesomeIcon title="Tryck för att " onClick={openLink} className="share" icon={faShare} />
        </div>
    </div>;
}

export default Solution;
