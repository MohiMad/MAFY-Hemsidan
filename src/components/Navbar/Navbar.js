import React from "react";
import "./Navbar.css";
import Button from "../Button/Button";
import Logo from "../Logo/Logo";
import Profile from "../Profile/Profile";

function Navbar({pathName, user}) {
  const prodLink = "https://discord.com/api/oauth2/authorize?client_id=1128229936012996639&redirect_uri=https%3A%2F%2Fmafy.up.railway.app%2F&response_type=code&scope=identify";
  // eslint-disable-next-line no-unused-vars
  const devLink = "https://discord.com/api/oauth2/authorize?client_id=1128229936012996639&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin%2Fdiscord&response_type=code&scope=identify";

  console.log("??", process.env.NODE_ENV);
  return (
    <nav className="nav">
      <div className="logo-holder">
        <Logo />
        <span className="route">{pathName}</span>
      </div>
      {
        user && user?.code !== 400 ? <Profile user={user} /> : (<Button><a href={prodLink}>Logga in</a></Button>)
      }

    </nav>
  );
}

export default Navbar;
