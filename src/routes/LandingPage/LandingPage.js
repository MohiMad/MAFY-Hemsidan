import React from "react";
import "./LandingPage.css";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileCircleQuestion, faQuestionCircle, faRandom} from '@fortawesome/free-solid-svg-icons';
import FormulasSection from "../../components/FormulasSection/FormulasSection";
import Statistik from "../Statistik/Statistik";

function LandingPage(props) {
  return (
    <div className="main-container">
      <h1 className="animate">Matematik- och fysikprovet gjord enkelt!</h1>
      <div className="part-container animate">
        <div className="or-hr">
          <span>eller</span>
        </div>
        <NavLink to="/matematik" className="matte">
          <div className="img"></div>
          <span>Gör matten...</span>
        </NavLink>
        <NavLink to="/fysik" className="fysik">
          <div className="img"></div>
          <span>...gör fysiken</span>
        </NavLink>
      </div>
      <h2 className="animate">Allt du behöver, på ett och samma plats!</h2>
      <section id="features">
        <div className="feature animate">
          <FontAwesomeIcon icon={faFileCircleQuestion} />
          <h3>Interaktiva prov</h3>
          <p>Vår hemsida erbjuder en förbättrad provupplevelse genom våra interaktiva prov som ger dig omedelbar återkoppling på dina svar.</p>
        </div>
        <div className="feature animate">
          <FontAwesomeIcon icon={faQuestionCircle} />
          <h3>Se lösningsförslag</h3>
          <p>Utforska olika lösningsförslag från andra personer och inspireras av deras metoder att lösa en uppgift. Samtidigt har du möjligheten att dela med dig din innovativa lösning.</p>

        </div>
        <div className="feature animate">
          <FontAwesomeIcon icon={faRandom} />
          <h3>Kategoriserade frågor</h3>
          <p>Sortera frågorna från gamla prov utifrån vad du bedömer att du behöver öva på. Vi har kategoriserat frågorna åt dig utifrån år eller vilket ämne som frågan berör.</p>
        </div>
      </section>
      <Statistik />
      <FormulasSection />
      {/* <section id="challenge">
        <h2>Så vad väntar du på?</h2>
        <p>Ta steget mot dina drömmar och börja plugga till Matematik- och Fysik provet!</p>
      </section> */}
    </div>
  );
}

export default LandingPage;
