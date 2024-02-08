import React from "react";
import "./Footer.css";
import Logo from "../Logo/Logo";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDiscord, faGithub} from '@fortawesome/free-brands-svg-icons';

function Footer() {
    const discordLink = "https://discord.com/invite/tYFFJKuKAW";
    const sourceCodeLink = "https://github.com/MohiMad/MAFY-Hemsidan";

    const toTop = () => {
        window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
    };

    return <footer id="footer">
        <div className="equal-divider">
            <div className="col">
                <Logo />
            </div>
            <div className="col locations">
                <h3>Vart vill du gå?</h3>
                <NavLink onClick={toTop} to="/matematik/år">Plugga matte</NavLink>
                <NavLink onClick={toTop} to="/fysik/år">Plugga fysik</NavLink>
                <NavLink onClick={toTop} to="/formler">Våra formelsamlingar</NavLink>
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
            <span>© 2023 MAFY - </span>
            <NavLink onClick={toTop} to="/användaravtal">Användaravtal</NavLink>
        </div>
    </footer>;
}

export default Footer;
