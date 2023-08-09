import React from "react";
import Button from "../Button/Button";

function Logo() {
    // eslint-disable-next-line no-unused-vars
    const prodLink = "https://discord.com/api/oauth2/authorize?client_id=1128229936012996639&redirect_uri=https%3A%2F%2Fmafy.up.railway.app%2Fapi%2Flogin%2Fdiscord&response_type=code&scope=identify";
    // eslint-disable-next-line no-unused-vars
    const devLink = "https://discord.com/api/oauth2/authorize?client_id=1128229936012996639&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Flogin%2Fdiscord&response_type=code&scope=identify";

    return <Button><a href={prodLink}>Logga in</a></Button>;
}

export default Logo;
