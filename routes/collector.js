'use strict';
let request    = require('request');
let validator   = require('validator');

let collector = {
    collect: (req, res) => {
        let url      = req.query.url;
        let vOptions = {
            protocols: ['http', 'https']
        };

        if (typeof url == 'undefined' || url == '') {
            res.json({
                status: '400',
                error:  'An empty url is not an url at all :('
            });
        }

        if (!validator.isURL(url, vOptions)) {
            res.json({
                status: '400',
                error:  'Wrong url :('
            });
        }
        res.json({res: 'Collect selectors'});
    }
}

module.exports = collector;
