const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        ID: {type: String, required: true, unique: true},
        username: {type: String, required: true},
        name: {type: String},
        avatar: {type: String},
        accessToken: {type: String, required: true},
        refreshToken: {type: String, required: true},
        correct: {type: Array},
        wrong: {type: Array}
    },
    {collection: 'mafy_users'}
);

const model = mongoose.model('UserData', User);

module.exports = model;