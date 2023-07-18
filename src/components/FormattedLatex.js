import React from "react";
import Latex from "react-latex";

function FormattedLatex({children}) {
    const formattedLatexExp = children.split(/\n/g);
    console.log(formattedLatexExp);


    return (formattedLatexExp.map(x => {
        const regexPattern = /(\$\$(.*?)\$\$)/g;
        const matches = [...x.matchAll(regexPattern)];
        const contents = matches.map(match => match[1]);
        console.log(x.split(contents[0]));
        return <>
            <Latex displayMode={false}>{x}</Latex>
            <br />
        </>;
    }

    ));
}

export default FormattedLatex;
