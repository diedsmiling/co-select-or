'use strict';
let requrest = require('request');

let collector = {
    collect: (req, res) => {
        console.log(req);
        res.json({res: 'Collect selectors'});
    }
}

module.exports = collector;
