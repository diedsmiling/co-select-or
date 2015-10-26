'use strict';
let request    = require('request');
let validator   = require('validator');

class Collector {
    validate(url) {
        let vOptions = {
            protocols: ['http', 'https']
        };

        if (typeof url == 'undefined' || url == '') {
            return [false, 400, 'An empty url is not a url at all :('];
        }

        if (!validator.isURL(url, vOptions)) {
            return [false, 400, 'Wrong url :('];
        }

        return [true, 200];
    }
    collect(req, res) {
        if (typeof req == 'undefined') {
            return false;
        }

        let url      = req.query.url;
        let [isValid, code, msg] = this.validate(url);

        if (!isValid) {
            res.status(code);
            res.json({
                status:  code,
                error:  msg
            });
            return false;
        }
    }
}

module.exports = Collector;
