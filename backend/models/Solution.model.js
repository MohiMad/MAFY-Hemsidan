const mongoose = require('mongoose');

const Solution = new mongoose.Schema(
    {
        questionNum: {type: String},
        solutions: {type: Array}
        /**
         * [ 
         *  {
         *      ID: ...,
         *      uploadedAt: ...,
         *      solution: ...,
         *      type: image|text|video,
         *      deletehash...,
         *      width: ...,
         *      height: ...
         *  } 
         * ]
         */
    },
    {collection: 'solutions'}
);

const model = mongoose.model('Solution', Solution);

module.exports = model;