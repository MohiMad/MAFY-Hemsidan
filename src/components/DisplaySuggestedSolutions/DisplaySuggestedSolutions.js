import React, {useEffect, useState, useCallback, useRef} from "react";
import "./DisplaySuggestedSolutions.css";
import Button from "../Button/Button";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faX, faUpload} from '@fortawesome/free-solid-svg-icons';
import {NavLink} from 'react-router-dom';
import Latex from "react-latex";
import Utility from "../../Utility";
import Solution from "../Solution/Solution";
import LoginButton from "../LoginButton/LoginButton";
import ExternalSolutions from "../ExternalSolutions/ExternalSolutions";


const msg_obj = {
    0: "",
    1: {msg: "Din lösning har laddats upp!", color: "--color-green"},
    2: {msg: "Lösningen gick inte att ladda upp. Försök igen", color: "--color-red"},
    3: {msg: "Vänta medan vi laddar upp din lösning...", color: "--color-yellow"},
    4: {msg: "Lösningen har tagits bort.", color: "--color-green"},
    5: {msg: "Det gick inte att ta bort lösningen. Försök igen.", color: "--color-red"},
    6: {msg: "Din lösning är för kort!", color: "--color-red"}
};

const original_latex = "Din kod i $\\LaTeX$ visas här...";


function DisplaySuggestedSolutions({user, questions, questionNum, shouldDisplaySecondayButtons}) {
    const [solutions, setSolutions] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(0);
    const textareaRef = useRef();
    const [latexCode, setLatexCode] = useState(original_latex);


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

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInput = useCallback(async (files) => {
        setUploadStatus(3);
        const formData = new FormData();
        formData.append("sampleFile", files[0]);

        try {
            const res = await fetch(`/api/user/post/solution/image/${ questions[questionNum].questionNum }`, {
                method: 'POST',
                body: formData
            });

            if(res.ok) {
                const updatedSolutions = await res.json();
                setSolutions(updatedSolutions);
                setUploadStatus(1);
                setTimeout(() => setUploadStatus(0), 3000);
            } else {
                throw new Error(msg_obj["2"]);
            }
        } catch(error) {
            setUploadStatus(2);
        }
    }, [questionNum, questions]);

    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if(files.length && files[0].type.match('image.*')) {
            handleFileInput(files);
        }
    };



    useEffect(() => {
        const handlePaste = (e) => {
            if(e.clipboardData && e.clipboardData.files.length > 0) {
                const files = e.clipboardData.files;
                if(files[0].type.match('image.*')) {
                    handleFileInput(files);
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handleFileInput]);

    const textareaContentChange = (e) => {
        const textarea = e.target;
        const latexDisplay = document.querySelector('.latex-display');

        textarea.style.height = 'auto';
        latexDisplay.style.height = 'auto';

        const newHeight = `${ textarea.scrollHeight }px`;
        textarea.style.height = newHeight;
        latexDisplay.style.height = newHeight;

        setLatexCode(textarea.value);
    };


    const latexUpload = async () => {
        if(latexCode.toString() === original_latex || latexCode.toString().length < 20) {
            setUploadStatus(6);
            setTimeout(() => setUploadStatus(0), 3000);
        }

        setUploadStatus(3);
        const formData = new FormData();
        formData.append("latex", latexCode.toString());

        try {
            const res = await fetch(`/api/user/post/solution/latex/${ questions[questionNum].questionNum }`, {
                method: 'POST',
                body: formData
            });

            if(res.ok) {
                const updatedSolutions = await res.json();
                setSolutions(updatedSolutions);
                setUploadStatus(1);
                setLatexCode(original_latex);
                setTimeout(() => setUploadStatus(0), 3000);
            } else {
                throw new Error(msg_obj["2"]);
            }
        } catch(error) {
            setUploadStatus(2);
        }
    };

    return (
        shouldDisplaySecondayButtons &&
        (
            <>
                {uploadStatus !== 0 && <div className="upload-status" style={{background: `var(${ msg_obj[uploadStatus].color })`}}>{msg_obj[uploadStatus].msg}</div>}
                <Button
                    className="show-solutions-btn"
                    onClick={showModal}
                >Visa lösningsförslag</Button>
                <div onClick={showModal} className="popover">
                    <div onClick={(e) => e.stopPropagation()} className="modal">
                        <FontAwesomeIcon onClick={showModal} className="x" icon={faX} />
                        <ExternalSolutions questionNum={questions[questionNum].questionNum} />
                        <h3>Lösningsförslag från användare:</h3>
                        <div className="solutions-holder">
                            {(solutions?.solutions?.length > 0) ? (
                                solutions.solutions.map(solution => (<Solution user={user} solutions={solutions} setSolutions={setSolutions} solution={solution} setUploadStatus={setUploadStatus} />)
                                )
                            ) : (<span>Tyvärr... Här fanns det inga lösningsförslag.</span>)}
                        </div>
                        <hr />
                        <div className="upload-solution-divider">
                            <h3>Dela med oss din lösning!</h3>
                            {(user) ?
                                (<span>Här kan du ladda upp ditt lösningsförslag. (*)</span>) :
                                (<span>Du behöver vara inloggad för att kunna ladda upp lösningar.</span>)
                            }

                            {(user) ? (
                                <>
                                    <div className="form-holder" onDragOver={handleDragOver} onDrop={handleDrop}>
                                        <form action="" id='uploadForm' encType="multipart/form-data">
                                            <label className="image-label-btn" htmlFor="sampleFile">
                                            </label>
                                            <input id="sampleFile" hidden onChange={(e) => handleFileInput(e.target.files)} type="file" name="sampleFile" accept="image/x-png,image/jpeg,image/png,image/jpg" />
                                            <FontAwesomeIcon className="fa-upload-form-icon" icon={faUpload} />
                                            <span>Dra, ladda upp eller klistra in bild här</span>
                                        </form>
                                    </div>
                                    <hr />
                                    <div className="column">
                                    </div>
                                    <h3>Alternativt: Ladda upp lösning i LaTeX</h3>
                                    <span>Här nedan kan du skriva din lösning i LaTeX eller vanlig text, det är upp till dig. (*)</span>
                                    <br />
                                    <br />
                                    <div className="latex-upload-container">
                                        <textarea ref={textareaRef} onChange={textareaContentChange} placeholder="Din kod i $\LaTeX$ visas här..." name="latex" id="latexcode">
                                        </textarea>
                                        <div className="latex-display">
                                            <Latex displayMode={false}>{latexCode}</Latex>
                                        </div>
                                    </div>
                                    <Button onClick={latexUpload} className="latex-upload-btn">Ladda upp LaTeX lösning</Button>
                                    <br />
                                    <span>
                                        <b>* OBS: </b>
                                        Genom att ladda upp denna lösning bekräftar du att du följer <NavLink className="hyperlink" to="/kontakta-oss">vår policy</NavLink> för lösningsuppladdning.
                                    </span>
                                </>
                            ) : (
                                <div className="login-btn-holder">
                                    <LoginButton />
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default DisplaySuggestedSolutions;
