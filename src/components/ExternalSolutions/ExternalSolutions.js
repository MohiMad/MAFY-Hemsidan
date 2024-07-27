import React from "react";

import Embed from "../Embed/Embed";
import externalSolutions from "../../assets/json/externalSolutions.json";


function ExternalSolutions({questionNum}) {
    const externalSolution = externalSolutions.find(x => x.questionNum === questionNum);

    return (
        <>
            {
                externalSolution &&
                (
                    <>
                        <h3>Lösningsförslag från externa källor</h3>
                        {externalSolution.links.map(link => <Embed key={link.toString()} link={link} />)}
                    </>
                )
            }
        </>
    );
}


export default ExternalSolutions;
