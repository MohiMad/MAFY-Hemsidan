import React, {useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAndroid, faAppStoreIos} from '@fortawesome/free-brands-svg-icons';
import {faDesktop, faDownload} from '@fortawesome/free-solid-svg-icons';

import AnkiMathFlaschCardsAPKG from "../../assets/apkg/MAFY__Mattematik formler.apkg";
import AnkiPhysicsFlaschCardsAPKG from "../../assets/apkg/MAFY__Fysik formler.apkg";
import './AnkiPage.css';

function AnkiPage(props) {
    const ankiPCLink = "https://apps.ankiweb.net/";
    const ankiAndroidLink = "https://play.google.com/store/apps/details?id=com.ichi2.anki&hl=sv&gl=US&pli=1";
    const ankiIOSLink = "https://apps.apple.com/se/app/ankimobile-flashcards/id373493387";


    useEffect(() => window.scroll({top: 0, behavior: "smooth"}));

    return (
        <section id="anki">
            <h1>Anki flashcards för Matematik- och fysikprovet</h1>
            <h2>Vad är Anki?</h2>
            <p>Anki är populär programvara och mobilapp som används för att skapa kortlekar (flashcards). Anki använder sig av en teknik så kallad "spaced repetition" för att maximera din inlärningsförmåga av ny information. Vi har skapat två kortlekar för matematik respektive fysikformler som viktiga att kunna inför Matematik- och fysikprovet.</p>
            <h2>Hur laddar jag ned Ankikortlekarna?</h2>
            <p>Det är bara att <a href={ankiPCLink}>ladda ned</a> och installera Anki på din enhet och sedan importera kortlekarna med hjälpa av länkarna nedan:</p>
            <h3>Hämta Anki genom följande externa länkar</h3>
            <div className="btn-container">
                <a href={ankiPCLink} target="_blank" rel="noopener noreferrer" className="pc-btn btn">
                    <FontAwesomeIcon icon={faDesktop} />
                    <span>Anki för PC</span>
                </a>
                <a href={ankiAndroidLink} target="_blank" rel="noopener noreferrer" className="android-btn btn">
                    <FontAwesomeIcon icon={faAndroid} />
                    <span>Anki för Android</span>
                </a>
                <a href={ankiIOSLink} target="_blank" rel="noopener noreferrer" className="ios-btn btn">
                    <FontAwesomeIcon icon={faAppStoreIos} />
                    <span>Anki för iOS</span>
                </a>
            </div>
            <h3>Ladda ned Ankikortlekarna för matte- och fysikformler</h3>
            <div className="btn-container">
                <a href={AnkiMathFlaschCardsAPKG} target="_blank" rel="noopener noreferrer" className="pc-btn btn">
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Kortlek för matteformler</span>
                </a>
                <a href={AnkiPhysicsFlaschCardsAPKG} target="_blank" rel="noopener noreferrer" className="pc-btn btn">
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Kortlek för fysikformler</span>
                </a>
            </div>
        </section>
    );
}

export default AnkiPage;