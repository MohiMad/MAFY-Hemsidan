import React from "react";
import "./Navbar.css";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Profile from "../Profile/Profile";

function Navbar({pathName, user}) {
  return (
    <nav className="nav">
      <div className="logo-holder">
        <Logo />
        <span className="route">{pathName}</span>
      </div>
      {
        user && user?.code !== 400 ? <Profile user={user} /> : (<Button><a href="https://discord.com/api/oauth2/authorize?client_id=1128229936012996639&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin%2Fdiscord&response_type=code&scope=identify">Logga in</a></Button>)
      }

    </nav>
  );
}

export default Navbar;
