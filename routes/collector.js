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

    doRequest(url, callback) {
        request
            .get(url)
            .on('error', (error) => {
                console.log('error');
            })
            .on('response', (res) => {
                callback();
            });
    }

    collect(req, res) {
        if (typeof req == 'undefined') {
            return false;
        }

        let url = req.query.url;
        let [isValid, code, msg] = this.validate(url);

        if (!isValid) {
            res.status(code);
            res.json({
                status:  code,
                error:  msg
            });
            return false;
        }

        this.doRequest(url, this.parseForCss);
    }

    parseForCss() {
        console.log('Parsing for css ...');
    }
}

module.exports = Collector;
