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

    doRequest(url) {
        return new Promise(function(resolve, reject) {
            request
                .get(url)
                .on('error', (error) => {
                    reject(error);
                })
                .on('response', (res) => {
                    resolve(res);
                });
        });
    }
    parseForCss(url) {
        console.log('Parsing ' + url + ' for css ...');
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
        let $fn = this.parseForCss;
        this.doRequest(url, $fn)
            .then($fn(url))
            .catch((error) => {
                res.status(500);
                res.json({
                    status:  error.code,
                    error:  'Request has failed'
                });
            });
    }
}

module.exports = Collector;
