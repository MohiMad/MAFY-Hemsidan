import React from 'react';
import Utility from '../../Utility';
import {NavLink} from 'react-router-dom';
import "./FilterTopics.css";

function FilterTopics({isMath}) {
    const [topics, setTopics] = React.useState([]);

    React.useEffect(() => {
        const numberedKeywords = Utility.getNumberedKeywords(isMath);
        const keywordsArray = Array.from(numberedKeywords, ([key, value]) => ({name: key, value: value}));
        setTopics(keywordsArray);
    }, [isMath]);

    return (
        <div className="filter-topics-div">
            <h1>Välj ämne...</h1>
            <div className="topics-container">
                {
                    topics.map((x) => {
                        return <NavLink key={x.name} to={`./${ x.name }/`}>
                            {x.name}<br />
                            <span>{x.value} frågor</span>
                        </NavLink>;
                    })
                }
            </div>
        </div>
    );
}

export default FilterTopics;