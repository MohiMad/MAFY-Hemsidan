import React from "react";
import Latex from "react-latex";
import Utility from "../Utility";

function FormattedLatex({children}) {
    const formattedLatexExp = children
        .replace(/\$\$.*?\$\$/g, "\n$&\n")
        .replace(/!\[\]\(.*?\)/ig, "")
        .split(/\n/g);

    const image = children.match(/!\[\]\(.*?\)/);

    return (
        <>
            {formattedLatexExp.map((x, i) => (
                <React.Fragment key={Utility.uniqueKey(x.toString() + i)}>
                    <Latex trust={true} strict={false} displayMode={false}>{x}</Latex>
                    <br />
                </React.Fragment>
            ))}
            {image?.length > 0 && <img className="img-in-question" alt="figur" src={image[0].replace(/!\[\]\(|\)/g, "")} />}
        </>
    );
}

export default FormattedLatex;
