import React from "react";
import "./Solution.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShare, faTrash} from '@fortawesome/free-solid-svg-icons';
import Utility from "../../Utility";
import Latex from "react-latex";

function Solution({solution, solutions, setSolutions, user, setUploadStatus}) {
    const openLink = (e) => {
        e.stopPropagation();
        window.open(`https://i.imgur.com/${ solution.solution.split(".com/")[1] }`);
    };

    const deleteSolution = async (e) => {
        e.stopPropagation();
        // removing the solution from the solutions array
        setSolutions(solutions => ({...solutions, solutions: solutions.solutions.filter(x => x.solutionID !== solution.solutionID)}));
        // removing the solution from the backend
        try {
            await Utility.postData(`${ window.location.origin }/api/solutions/delete/${ solutions.questionNum }/${ solution.solutionID }`);
            setUploadStatus(4);
        } catch(e) {
            setUploadStatus(5);
        }

        setTimeout(() => setUploadStatus(0), 3000);
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

        if(e.target.parentElement.classList.contains("expand")) {
            setTimeout(() => {
                e.target.parentElement.scrollIntoView({behavior: "smooth", block: "start"});
            }, 300); // Adjust time as needed for CSS transitions
        }

    };

    return <div className="solution-holder" style={{
        backgroundImage: `${ solution.type !== "latex" ? "url(" + solution.solution + ")" : "none" }`,
        height: "25vh !important"
    }} data-height={solution.height}>
        <div onClick={displaySolution} className="overlay"></div>
        <span className="solution-header">{`${ solution.name }s lösning`}</span>
        <div className="solution-popover">
            {solution.type === "latex" && (
                <Latex>{solution.solution}</Latex>
            )}
        </div>
        <div onClick={displaySolution} className="options-container">
            {solution.type !== "latex" && (<FontAwesomeIcon title="Öppna bild i Imgur." onClick={openLink} className="icon-action share" icon={faShare} />)}
            {user.ID === solution.ID && (<FontAwesomeIcon title="Ta bort lösning." onClick={deleteSolution} className="icon-action delete-solution" icon={faTrash} />)}
        </div>
    </div>;
}

export default Solution;
