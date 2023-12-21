import React, {useState, useEffect} from 'react';
import "./Embed.css";
import axios from 'axios';

const pluggakutenLink = "https://www.pluggakuten.se/";

function Embed({link}) {
    const [metaData, setMetaData] = useState({title: '', description: '', image: ''});

    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                const response = await axios.get(`https://api.microlink.io?url=${ encodeURIComponent(pluggakutenLink + link) }`);
                const data = response.data.data;
                setMetaData({
                    title: data.title,
                    description: data.description + "...",
                    image: data.image ? data.image.url : ''
                });
            } catch(error) {
                console.error('Error fetching metadata:', error);
            }
        };

        fetchMetaData();
    }, [link]);

    return (
        <a className="embed-anchor" href={link} target="_blank" rel="noreferrer">
            <div className="link-embed">
                <h3>{metaData.title}</h3>
                <div className="desc-and-image-holder">
                    <p>{metaData.description}</p>
                    {metaData.image && <div
                        className="image-container"
                        style={{
                            backgroundImage: `url(${ metaData.image })`
                        }} />}
                </div>
            </div>
        </a>
    );

}

export default Embed;
