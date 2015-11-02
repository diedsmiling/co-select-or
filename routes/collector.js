'use strict';
let request     = require('request');
let validator   = require('validator');
let cheerio     = require('cheerio');
var cssom       = require('cssom');
//var jsdom       = require('jsdom');

class Collector {

    /**
     * Validates url
     *
     * @param {str} url
     * @returns {*[]}
     */
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

    /**
     * Fires a request
     *
     * @param {str} url
     * @returns {Promise}
     */
    doRequest(url) {
        let chunks = [];
        return new Promise((resolve, reject)=> {
            request
                .get(url)
                .on('error', (error) => {
                    reject(error);
                })
                .on('data', (chunk) => {
                    chunks.push(chunk);
                })
                .on('end', () => {
                    let body = chunks.join('');
                    resolve(body);
                });
        });
    }

    seekStyles(body) {
        let outerStyles = [];
        let innerStyles = [];
        let $ = cheerio.load(body);
        console.log(body);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                $('style').each((i, e) => {
                    innerStyles.push($(e).text());
                });

                $('link').each((i, e) => {
                    //if($(e).attr('rel') == )
                });
                if (innerStyles.length == 0 && outerStyles.length == 0) {
                    reject(new Error('No styles found'));
                } else {
                    resolve([innerStyles, outerStyles]);
                }
            }, 0);
        });
    }

    getOuterStyleContents(url) {
        //let ur = '//cdn.sstatic.net/stackoverflow/all.css?v=f8f728b3fa0c';
        //console.log(validator.isURL(ur, {allow_protocol_relative_urls: true}));
    }

    /**
     * Does the main thing - collects selectors
     *
     * @param {obj} req
     * @param {obj} res
     * @returns {bool}
     */
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

        this.doRequest(url)
            .then(this.seekStyles)
            .catch((error) => {
                res.status(500);
                res.json({
                    status:  error.code,
                    error:  'Request has failed!'
                });
            });
    }
}

module.exports = Collector;
