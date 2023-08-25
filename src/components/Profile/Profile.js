import React from "react";
import "./Profile.css";
// eslint-disable-next-line no-unused-vars
import {NavLink} from "react-router-dom";
import PFP from "../../assets/img/pfp.jpg";

function Profile({user}) {
    const url = (user?.ID && user?.avatar) ?
        (`https://cdn.discordapp.com/avatars/${ user.ID }/${ user.avatar }`) :
        PFP;

    // Redirect:a till en Profil-sida för varje användare i framtiden...

    /* return <NavLink to="/profile">
        <div className="profile" style={{background: `url(${ url })`}} ></div>
        </NavLink>; */

    return <div className="profile" style={{background: `url(${ url })`}} ></div>;
}

export default Profile;
