# Välkommen till [MAFY](https://mohikan.notion.site/mohikan/MAFY-Hemsidan-d5ddd0e8481b43508ef2b7dfa60edc2a)!
Denna repository:n använder Node.JS, en förutsättning är att du har Node.js installerat på din maskin.

## Hur använder jag denna repo?
För att klona denna repository får du trycka på den gröna "Code" knappen ovan och sedan välja vilken metod du vill använda.
När du har repository:n klonad får du köra `npm install` för att ladda ner alla dependencies.

I `package.json` finns det flera kommandon som du kan använda för att:
1. Köra endast backend: `npm run start-server`
2. Köra endast frontend: `npm run start-client`
3. Köra både backend och frontend (produktion): `npm run start`

För att backend:en ska köras som det ska finns det flera miljövariabler som krävs, se `./backend/example.env`

Frontend:en kan köras utan behov till dessa miljövariabler 
(genom kommandon `npm run start-client`)

## Vad kan jag bidra med?
Det finns flera saker man kan bidra till för utvecklingen av denna tjänst
Vissa av dessa kräver igen till nästan ingen erfarenhet av programmering till exempel:

* Korrigering av språk

* Korrigering av de LaTeX-formatterade frågorna i `(./backend/public/json/math.json och ./backend/public/json/physics.json)`
    För att konvertera frågorna till text och (LaTeX) användes tjänsten MathPix.
    Dock kan det förekomma vissa särstavningar eller att vissa LaTeX uttryck laddas upp fel 

* Infoga bilder för fysikdelen `(./backend/public/json/physics.json)`
    Många frågor i fysikdelen använder figurer (som oftast saknas).
    Figurerna måste därför skärmdumpas och laddas upp manuellt i `physics.json`-filen.
    Enklaste sättet är uppladdning m.h.a imgur.com. Länken till Imgur-bilden (måste avsluta med .png eller .jpg) kan sedan kopieras och infogas för respektive fråga.
    För att snabbt hitta vilka frågor som saknar bilder kör `CTRL + F` och sök "img".

### Om du är erfaren av programmering kan du:
* Förbättra koden 
    Mycket är koden är "over-rushed", saknar kommentarer eller dokumentering, så det är hjälpsamt att förbättra koden genom omanvändbara funktioner etc.

* Skapa Unit Tests
    Denna repo saknar i nuläget Unit Tester totalt. En redan-nedladdad Testing-Library är JEST, det rekommenderas att användas.

* Bidra till utvecklingen av funktioner för tjänster 
    Gå till [TODO-LISTAN](https://mohikan.notion.site/TODO-Listan-212afe7744754fd58ff30ec6ecec331a?pvs=4)
