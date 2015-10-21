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
            res.status(400);
            res.json({
                status: '400',
                error:  'An empty url is not an url at all :('
            });
            return true;
        }

        if (!validator.isURL(url, vOptions)) {
            res.status(400);
            res.json({
                status: '400',
                error:  'Wrong url :('
            });
            return true;
        }

        request(url, collector.requestCallback);
    },
    requestCallback: (error, response, body) => {
        console.log(response);
    }

}

module.exports = collector;
