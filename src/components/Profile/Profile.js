import React from "react";
import "./Profile.css";
import {NavLink} from "react-router-dom";


function Profile({user}) {
    const url = `https://cdn.discordapp.com/avatars/${ user.ID }/${ user.avatar }`;
    return <NavLink to="/profile"><div className="profile" style={{background: `url(${ url })`}} ></div></NavLink>;
}

export default Profile;
