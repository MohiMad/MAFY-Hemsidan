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
