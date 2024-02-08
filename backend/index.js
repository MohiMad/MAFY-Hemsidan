require('dotenv').config();
const express = require("express");
const app = express();
const routes = require("./routes/index.js");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {deserialize} = require('./src/Session.js');

const {initializeApp} = require("firebase/app");
const {getAnalytics} = require("firebase/analytics");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_apiKey,
    authDomain: process.env.FIREBASE_authDomain,
    projectId: process.env.FIREBASE_projectId,
    storageBucket: process.env.FIREBASE_storageBucket,
    messagingSenderId: process.env.FIREBASE_messagingSenderId,
    appId: process.env.FIREBASE_appId,
    measurementId: process.env.FIREBASE_measurementId
};

const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
console.log(analytics);

mongoose.connect(process.env.DB_URI);

app.use(cors({orgin: process.env.domain}));
app.use(fileUpload());

app.set('views', path.join(__dirname, "..", "build"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, "..", "build")));
app.use("/public", express.static("public"));

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET,
    name: 'DISCORD_OAUTH2_SESSION_ID',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 * 24 * 7
    }
}));

app.use(deserialize);

app.use("/api/", routes);

app.get("/*", (req, res) => {
    res.render("./index.html");
});


app.listen(process.env.PORT || 3000);

module.exports = app;
