const {Router} = require('express');
const fs = require("fs");
const router = Router();
const path = require("path");

fs.readdirSync(__dirname).filter(name => !name.startsWith("index")).forEach(route => {
    if(route.endsWith(".js")) {
        router.use(`/${ route.replace(".js", "") }`, require(path.join(__dirname, `/${ route }`)));
    } else {
        fs.readdirSync(path.join(__dirname, `/${ route }`)).forEach(endpoint => {
            router.use(`/${ route }/${ endpoint.replace(".js", "") }`, require(path.join(__dirname, `/${ route }/${ endpoint }`)));
        });
    }
});

module.exports = router;