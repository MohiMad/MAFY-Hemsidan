import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import './Embed.css';

const pluggakutenLink = "https://www.pluggakuten.se/";

const cache = {};

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

function Embed({link}) {
    const [metaData, setMetaData] = useState({title: '', description: '', image: ''});
    const debouncedLink = useDebounce(link, 300);

    useEffect(() => {
        const fetchMetaData = async () => {
            const url = pluggakutenLink + debouncedLink;

            if(cache[url]) {
                setMetaData(cache[url]);
                return;
            }

            try {
                const response = await axios.get(`https://api.microlink.io?url=${ encodeURIComponent(url) }`);
                const data = response.data.data;
                const metaData = {
                    title: data.title,
                    description: data.description + "...",
                    image: data.image ? data.image.url : ''
                };
                cache[url] = metaData; // Cache the metadata
                setMetaData(metaData);
            } catch(error) {
                console.error('Error fetching metadata:', error);
            }
        };

        if(debouncedLink) {
            fetchMetaData();
        }
    }, [debouncedLink]);

    return (
        <a className="embed-anchor" href={pluggakutenLink + link} target="_blank" rel="noopener noreferrer">
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
