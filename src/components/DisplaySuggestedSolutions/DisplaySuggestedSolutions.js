import React, {useEffect, useState} from "react";
import "./DisplaySuggestedSolutions.css";
import Button from "../Button/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX} from '@fortawesome/free-solid-svg-icons';
import Utility from "../../Utility";
import Solution from "../Solution/Solution";


function DisplaySuggestedSolutions({questions, questionNum, shouldDisplaySecondayButtons}) {
    const [solutions, setSolutions] = useState(false);

    useEffect(() => {
        async function fetchSolutions() {
            const solutionsResponse = await Utility.get(`/api/solutions/${ questions[questionNum]?.questionNum }`);
            if(!solutionsResponse || solutionsResponse.code === 404) return setSolutions(false);
            setSolutions(solutionsResponse);
        }

        fetchSolutions();
    }, [questionNum, questions]);

    const showModal = (e) => {
        e.stopPropagation();
        document.querySelector(".popover").classList.toggle("show");

    };

    const fileUploaded = async (e) => {
        e.preventDefault();
        const uploadForm = document.getElementById("uploadForm");
        const formData = new FormData(uploadForm);

        const res = await fetch(`/api/user/post/solution/image/${ questions[questionNum].questionNum }`, {
            method: 'POST',
            body: formData
        });;

        if(res.ok) {
            const reader = res.body.getReader();
            let content = '';

            // Read the stream until it is fully consumed
            while(true) {
                const {done, value} = await reader.read();

                if(done) {
                    // Stream fully consumed
                    break;
                }

                // Convert the chunk (Uint8Array) to a string and append to the content
                const chunk = new TextDecoder().decode(value);
                content += chunk;
            }

            const data = JSON.parse(content);
            setSolutions(data);
        }
    };

    return (
        shouldDisplaySecondayButtons &&
        (
            <>
                <Button
                    className="show-solutions-btn"
                    onClick={showModal}
                >Visa lösningsförslag</Button>
                <div onClick={showModal} className="popover">
                    <div onClick={(e) => e.stopPropagation()} className="modal">
                        <FontAwesomeIcon onClick={showModal} className="x" icon={faX} />
                        <h3>Lösningsförslag från användare:</h3>
                        <div className="solutions-holder">
                            {solutions ? (
                                solutions.solutions.map(solution => (<Solution solution={solution} />)
                                )
                            ) : (<span>Tyvärr... Här fanns det inga lösningsförslag.</span>)}
                        </div>
                        <hr />
                        <div className="upload-solution-divider">
                            <h3>Dela med oss din lösning!</h3>
                            <span>Ladda upp ditt lösningsförslag här!</span>
                            <div className="form-holder">
                                <form action={(e) => e.preventDefault()} id='uploadForm' encType="multipart/form-data">
                                    <input id="sampleFile" hidden onChange={fileUploaded} type="file" name="sampleFile" accept="image/x-png,image/jpeg,image/png,image/jpg" />
                                    <label className="button" htmlFor="sampleFile">
                                        Välj bild
                                    </label>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default DisplaySuggestedSolutions;
