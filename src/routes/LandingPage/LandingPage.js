import React from "react";
import "./LandingPage.css";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileCircleQuestion, faQuestionCircle, faRandom} from '@fortawesome/free-solid-svg-icons';

function LandingPage(props) {
  return (
    <div className="main-container">
      <h1>Matematik- och fysikprovet gjord enkelt!</h1>
      <div className="part-container">
        <div className="or-hr">
          <span>eller</span>
        </div>
        <NavLink to="/matematik/år" className="matte">
          <div className="img"></div>
          <span>Gör matten...</span>
        </NavLink>
        <NavLink to="/fysik/år" className="fysik">
          <div className="img"></div>
          <span>...gör fysiken</span>
        </NavLink>
      </div>
      <h2>Allt du behöver, på ett och samma plats!</h2>
      <section id="features">
        <div className="feature">
          <FontAwesomeIcon icon={faFileCircleQuestion} />
          <h3>Interaktiva prov</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quo! Iure velit, voluptatibus, atque cumque natus facere quo ipsum porro nobis laudantium</p>
        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faQuestionCircle} />
          <h3>Se lösningsförslag</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quo! Iure velit, voluptatibus, atque cumque natus facere quo ipsum porro nobis laudantium</p>

        </div>
        <div className="feature">
          <FontAwesomeIcon icon={faRandom} />
          <h3>Kategoriserade frågor</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem, quo! Iure velit, voluptatibus, atque cumque natus facere quo ipsum porro nobis laudantium</p>
        </div>
      </section>
      <section id="challenge">
        <h2>Så vad väntar du på?</h2>
      </section>
    </div>
  );
}

export default LandingPage;
