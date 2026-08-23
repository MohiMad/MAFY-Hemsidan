import React from "react";
import Latex from "react-latex";

function FormattedLatex({children}) {
    const text = String(children ?? "");

    const formattedLatexExp = text
        .replace(/\$\$.*?\$\$/g, "\n$&\n")
        .replace(/!\[\]\(.*?\)/ig, "")
        .split(/\n/g);

    const image = text.match(/!\[\]\(.*?\)/);

    return (
        <>
            {formattedLatexExp.map((x, i) => (
                // The key must be stable across renders; a timestamp-based key
                // remounted every line (and the KaTeX render) on each render.
                <React.Fragment key={i}>
                    <Latex trust={true} strict={false} displayMode={false}>{x}</Latex>
                    <br />
                </React.Fragment>
            ))}
            {image?.length > 0 && <img className="img-in-question" alt="figur" src={image[0].replace(/!\[\]\(|\)/g, "")} />}
        </>
    );
}

export default FormattedLatex;
