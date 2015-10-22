'use strict';
let request    = require('request');
let validator   = require('validator');

class Collector {
    construcotr() {
        console.log(this);
        console.log('ada');
    }
    collect(req, res) {
        if (typeof req == 'undefined') {
            return false;
        }
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
            return false;
        }

        if (!validator.isURL(url, vOptions)) {
            res.status(400);
            res.json({
                status: '400',
                error:  'Wrong url :('
            });
            return false;
        }
    }

}

module.exports = Collector;
