import React from 'react';
import "./UserPolicyPage.css";
import {NavLink} from 'react-router-dom';

function UserPolicyPage(props) {
    return (
        <section id="policy">
            <h1>Användaravtal för MAFY Hemsidan</h1>
            <h2>Inledning</h2>
            <p>Välkommen till MAFY Hemsidan. Denna sida har utvecklats för att möjligöra och förenkla samarbete mellan studenter intresserade av att söka till program med hjälp av Matematik- och fysikprovet. Källkoden för MAFY Hemsidan är tillgänglig för alla att kika på och kontribuera till på <a className="hyperlink" href="https://github.com/MohiMad/MAFY-Hemsidan">MAFY-Hemsidan</a> github repo. När du loggar in på vår hemsida (med hjälp av Logga in knappen och Discord) godkänner du följande användaravtal. Vänligen läs detta avtal innan du fortsätter att använda vår tjänst.</p>
            <p>Genom att använda MAFY Hemsidan bekräftar du att du har läst och förstått detta Avtal samt att du samtycker till att följa dess villkor. Om du inte godkänner vilkoren till Avtalet kan du hänvisa till <a className='hyperlink' href="#borttagning-av-konto">borttagning av konto</a>.</p>
            <h2>Användning av kakor</h2>
            <p>Vi använder oss av kakor (cookies) för att behålla dig som användare inloggad på ditt konto genom att skapa och lagra sessioner på vår databas. Denna lagrade information hjälper oss att ge dig en smidig användarupplevelse. Observera att vi inte använder kakor för att lagra information om icke-inloggade användare.</p>
            <h2>Hantering av personlig information</h2>
            <p>När du loggar in på MAFY Hemsidan (genom Discord) godkänner du att vi kan komma åt och använda viss information från ditt Discord konto. Informationen som vår hemsida får tillgång till är: namn (name), användarnamn (username), profilbild och din Discord ID. MAFY Hemsidan har ingen tillgång till känsliga uppgifter som ditt lösenord, email eller telefonnummer.</p>
            <h3>Vad gör vi med din Discord information?</h3>
            <p>Informationen MAFY Hemsidan får tillgång till när du trycker på "Logga in"-knappen lagras på vår databas för att kunna koppla dig, som inloggad användare till ditt MAFY-Konto och kunna spara din utveckling (vilka uppgifter du gjorde etc). Vidare behöver vi denna information för att kunna tillåta dig som inloggad användare att ladda upp lösningsförslag för frågor.</p>
            <h2>Uppladdning av lösningsförslag</h2>
            <p>Genom att ladda upp lösningsförslag för frågor på vår hemsida samtycker du att inte ladda upp innehåll som är olagligt, stötande, trakasserande, hotande, diskriminerande, ärekränkande eller på annat sätt kränker tredje parts rättigheter. Vidare bekräftar du, när du ladda upp lösningsförslag på vår hemsida, att du äger rätten till det innehåll du delar. Vi förbehåller oss rätten att ta bort innehåll som vi anser bryter mot dessa villkor. Vid fortsatt brytning mot våra användarvillkor förbehåller vi oss rätten att ta bort ditt konto och tillfälligt eller permanent förbjuda dig från att använda vår tjänst.</p>
            <h2>Ändringar av användaravtalet</h2>
            <p>Vi förbehåller oss rätten att när som helst ändra detta Avtal genom att publicera en uppdaterad version på vår hemsida. Det är ditt ansvar att regelbundet granska detta Avtal för eventuella ändringar.</p>
            <h2 id="borttagning-av-konto">Kontoborttagning</h2>
            <p>Som inloggad användare har du rätt att begära att ditt konto och all din personliga information tas bort från vår databas om du inte godkänner våra användarvillkor. Detta innebär att du när som helst kan begära avslutning av ditt konto och att all information som är associerad med ditt konto raderas från vår databas. <NavLink className="hyperlink" to="/kontakta-oss">Kontakta oss</NavLink> för att begära borttagning av ditt konto</p>
            <h2>Kontakta oss</h2>
            <p>Om du har några funderingar kring detta användaravtal kan du <NavLink className="hyperlink" to="/kontakta-oss">kontakta oss</NavLink>.</p>
        </section>
    );
}

export default UserPolicyPage;