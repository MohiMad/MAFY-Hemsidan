import React from "react";
import Latex from "react-latex";

function FormattedLatex({children}) {
    const formattedLatexExp = children
        .replace(/\$\$.*?\$\$/g, "\n$&\n")
        .replace(/!\[\]\(.*?\)/ig, "")
        .split(/\n/g);

    const image = children.match(/!\[\]\(.*?\)/);

    return <>
        {(formattedLatexExp.map(x => {

            return <>
                <Latex trust={true} strict={false} displayMode={false}>{x}</Latex>
                <br />
            </>;
        }

        ))}
        {image?.length > 0 && <img className="img-in-question" alt="figur" src={image[0].replace(/!\[\]\(|\)/g, "")} />}
    </>;
}

export default FormattedLatex;
