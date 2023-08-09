import React from "react";
import Button from "../../components/Button/Button";
import fyFormelPDF from "../../assets/pdf/fy.pdf";
import maFormelPDF from "../../assets/pdf/ma.pdf";
import maFormelIMG from "../../assets/img/mof.jpg";
import fyFormelIMG from "../../assets/img/fof.jpg";
import {NavLink} from "react-router-dom";
import "./FormulasSection.css";

function FormulasSection() {
    const formelImgClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(e.target.classList.contains("math") ? maFormelPDF : fyFormelPDF, "_blank");
    };

    return (
        <section id="formulas">
            <h2>Få tillgång till våra formelsamlingar!</h2>
            <div className="img-and-p-divider">
                <div className="formulas-holder">
                    <img className="img math" onClick={formelImgClick} src={maFormelIMG} alt="Matematik formelsamling" title="Matematik formelsamling" loading="lazy" />
                    <img className="img physics" onClick={formelImgClick} src={fyFormelIMG} alt="Fysik formelsamling" title="Fysik formelsamling" loading="lazy" />
                </div>
                <div className="paragraphs-holder">
                    <p>Vi har skapat formelblad för både matematik- och fysikdelen som innehåller alla formler som du behöver känna till med för att lyckas på provet!   </p>
                    <p>Vi har även omvandlat formelbladen till Anki-flashcards för att göra det enklare för dig att memorera formlerna!</p>
                    <div className="btn-holder">
                        <NavLink to={maFormelPDF} target="_blank" rel="noopener noreferrer" ><Button>Matte formelsamling</Button></NavLink>
                        <NavLink to={fyFormelPDF} target="_blank" rel="noopener noreferrer" ><Button>Fysik formelsamling</Button></NavLink>
                        <NavLink to="/anki"><Button>Anki kort</Button></NavLink>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FormulasSection;
