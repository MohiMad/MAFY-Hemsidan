import React from "react";
import "./Footer.css";
import Logo from "../Logo/Logo";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiscord, faGithub} from '@fortawesome/free-brands-svg-icons';
import Utility from "../../Utility";

function Footer() {
    const discordLink = "https://discord.com/invite/tYFFJKuKAW";
    const sourceCodeLink = "https://github.com/MohiMad/MAFY-Hemsidan";

    return <footer id="footer">
        <div className="equal-divider">
            <div className="col">
                <Logo />
            </div>
            <div className="col locations">
                <h3>Vart vill du gå?</h3>
                <NavLink onClick={Utility.toTop} to="/matematik">Plugga matte</NavLink>
                <NavLink onClick={Utility.toTop} to="/fysik">Plugga fysik</NavLink>
                <NavLink onClick={Utility.toTop} to="/formler">Våra formelsamlingar</NavLink>
                <NavLink onClick={Utility.toTop} to="/statistik">Statistik för uppgifter</NavLink>
                <NavLink onClick={Utility.toTop} to="/kontakta-oss">Kontakt</NavLink>
            </div>
            <div className="col">
                <h3>Få hjälp</h3>
                <a href={discordLink} target="_blank" rel="noopener noreferrer" className="discord-btn btn">
                    <FontAwesomeIcon icon={faDiscord} />
                    <span>Vår Discord</span>
                </a>
            </div>
            <div className="col">
                <h3>Bidra</h3>
                <a href={sourceCodeLink} target="_blank" rel="noopener noreferrer" className="github-btn btn">
                    <FontAwesomeIcon icon={faGithub} />
                    <span>Source Code</span>
                </a>
            </div>
        </div>
        <div className="copyright-notice">
            <span>2023 MAFY - </span>
            <NavLink onClick={Utility.toTop} to="/anvandaravtal">Användaravtal</NavLink>
        </div>
    </footer>;
}

export default Footer;
