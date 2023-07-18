const mongoose = require('mongoose');

const Session = new mongoose.Schema(
    {
        sessionID: {type: String},
        expiresAt: {type: Date},
        data: {type: String}
    },
    {collection: 'sessions'}
);

const model = mongoose.model('Session', Session);

module.exports = model;