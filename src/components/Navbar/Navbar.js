import React from "react";
import "./Navbar.css";
import LoginButton from "../LoginButton/LoginButton";
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
        user && user?.code !== 400 ? <Profile user={user} /> : (<LoginButton />)
      }

    </nav>
  );
}

export default Navbar;
