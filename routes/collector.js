'use strict';
let request     = require('request');
let validator   = require('../helpers/extended_validator');
let cheerio     = require('cheerio');
var cssom       = require('cssom');

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
        let mainUrl = this.url;
        let styles = [];
        let outerStyles = [];
        let promises = [];
        let $ = cheerio.load(body);
        $('style').each((i, e) => {
            styles.push($(e).text());
        });

        $('link').each((i, e) => {
            if ($(e).attr('rel') == 'stylesheet') {
                let href = $(e).attr('href');
                if (validator.isRelativeUrl(href)) {
                    outerStyles.push(mainUrl + href);
                } else {
                    outerStyles.push(href);
                }
            }
        });
        return new Promise((resolve, reject)=> {
            if (styles.length == 0 && outerStyles.length == 0) {
                reject('There are no styles');
            } else {
                setTimeout(() => {
                    resolve({
                        parsed: styles,
                        notParsed: outerStyles
                    });
                }, 100);
            }
        });
    }
    parseOuterStyles(styles) {
        console.log(outerStyles);

        if (outerStyles.length > 0) {
            outerStyles.forEach((url) => {
                promises.push(this.doRequest(url));
            });

            Promise
                .all(promises)
                .then(function(values) {
                    values.forEach((content) =>  {
                        styles.push(content);
                    });
                    console.log(styles);
                    resolve(styles);
                })
                .catch(function(error) {
                    reject(new Error('Could not parse!'));
                });
        } else {
            if (styles.length > 0) {
                console.log('resolving ');
            //    resolve(styles);
            } else {
                console.log('rejecting! ');
              //  reject('No styles found!');
            }
        }
    }

    countSelectors(stylesheets) {

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
        this.url = url;
        this.doRequest(url)
            .then((body) => {
                return this.seekStyles(body);
            })
            .then((data) => {
                console.log('data', data);
            })
            .catch((error) => {
                console.log(error);
                res.status(500);
                res.json({
                    status:  error.code,
                    error:  'Request has failed!'
                });
            });
    }
}

module.exports = Collector;
