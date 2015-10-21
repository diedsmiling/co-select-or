'use strict';
let requrest    = require('request');
let validator   = require('validator');

let collector = {
    collect: (req, res) => {
        console.log(req.query.url);
        res.json({res: 'Collect selectors'});
    }
}

module.exports = collector;
