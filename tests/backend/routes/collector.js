'use strict';
let request     = require('request');
let nock        = require('nock');
let proxyquire  = require('proxyquire');
let cheerio     = require('cheerio');
let validator   = require('../../../helpers/extended_validator');

let errorObj = {
    status: 400,
    error:  ''
};
let req      = {
    query: {
        url: ''
    }
};
let res      = {
    json:   sinon.spy(),
    status: sinon.spy()
};

let htmlBody = '<html><body>An awesome site!</body></html>';
let url = 'http://theprotein.io/';
let Collector;
let collector;

describe('Collector', () => {

    beforeEach(() => {
        sinon.spy(request, 'get');
        sinon.spy(cheerio, 'load');
        sinon.spy(validator, 'isRelativeUrl');
        sinon.spy(cheerio.prototype, 'each');
        sinon.spy(cheerio.prototype, 'text');
        sinon.spy(cheerio.prototype, 'attr');

        Collector = proxyquire('../../../routes/collector', {
            request: request,
            cheerio: cheerio,
            '../helpers/extended_validator': validator
        });
        collector = new Collector();

        // Mocking http requests
        nock(url)
            .get('/')
            .reply(200, htmlBody);

        nock('http://missingurl.io')
            .get('/')
            .replyWithError(404);

        nock(url + 'style.css')
            .get('/')
            .reply(200, '.red {color: red;}');

        nock(url + 'public/style.css')
            .get('/')
            .reply(200, '.blue {color: blue}');

    });

    afterEach(() => {
        request.get.restore();
        cheerio.load.restore();
        cheerio.prototype.each.restore();
        cheerio.prototype.text.restore();
        cheerio.prototype.attr.restore();
        validator.isRelativeUrl.restore();
    });

    describe('collect() method', () => {

        it('should be defined', () => {
            expect(collector.collect).to.not.be.undefined;
        });

        it('should validate url', () => {
            sinon.spy(collector, 'validate');

            collector.collect(req, res);
            expect(collector.validate).to.be.called;
        });

        it('should do a request', () => {
            sinon.spy(collector, 'doRequest');
            req.query.url = url;

            collector.collect(req, res);
            expect(collector.doRequest).to.be.called;
            expect(collector.url).to.equal(url);
        });
    });

    describe('doRequest() method', () => {
        it('should be defined', () => {
            expect(collector.doRequest).to.not.be.undefined;
        });

        it('should make a request', () => {
            collector.doRequest(url);
            expect(request.get).to.be.called;
        });

        it('should reject on request error', () => {
            return collector
                .doRequest('http://missingurl.io/')
                .catch((error) => {
                    expect(error).to.deep.equal(new Error('404'));
                });
        });

        it('should resolve on valid request', () => {
            return collector
                .doRequest('http://theprotein.io/')
                .then((data) => {
                    expect(data).to.equal(htmlBody);
                });
        });

        it('should gather chunks to a string', () => {
            return expect(collector.doRequest('http://theprotein.io/'))
                .to.eventually.equal(htmlBody);
        });
    });

    describe('seekStyles', () => {
        beforeEach(() => {
            collector.url = url;
        });

        it('should be defined', () => {
            expect(collector.seekStyles).to.not.be.undefined;
        });

        it('should load body to cheerio', () => {
            collector.seekStyles(htmlBody);
            expect(cheerio.load).to.be.called;
        });

        it('should iterate inner styles if they were found', () => {
            let htmlBodyWithStyleTag =
                htmlBody
                    .replace('An awesome site!',
                    '<style>.class{color: red;}</style>!');
            collector.seekStyles(htmlBodyWithStyleTag);

            expect(cheerio.prototype.each).to.be.called;
            expect(cheerio.prototype.text).to.be.called;
        });

        it('should iterate with $.each() method if link tags where found', () => {
            let htmlBodyWithLinkTag =
                htmlBody
                    .replace('An awesome site!',
                        '<link rel="stylesheet" href="style.css/">An awesome site!');
            collector.seekStyles(htmlBodyWithLinkTag);

            expect(cheerio.prototype.each).to.be.called;
            expect(cheerio.prototype.attr).to.be.calledWith('rel');
            expect(cheerio.prototype.attr).to.be.calledWith('href');
        });

        it('should check if link url is relative or absolute', ()=> {
            let htmlBodyWithLinkTag =
                htmlBody
                    .replace('An awesome site!',
                    '<link rel="stylesheet" href="style.css/">');
            collector.seekStyles(htmlBodyWithLinkTag);

            expect(validator.isRelativeUrl).to.be.calledWith('style.css/');
        });

        it('should reject if no styles were found', () => {
            return collector.seekStyles(htmlBody)
                .catch((error) => {
                    expect(error).to.equal('There are no styles');
                });
        });

        it('should resolve if inner style were found', () => {
            let htmlBodyWithStyleTag =
                htmlBody
                    .replace('An awesome site!',
                    '<style>.class{color: red;}</style>!'
                );

            return collector
                .seekStyles(htmlBodyWithStyleTag)
                .then((data) => {
                    expect(data).to.deep.equal(
                        {
                            notParsed: [],
                            parsed: [
                                '.class{color: red;}'
                            ]
                        }
                    );
                });
        });

        it('should resolve if outer styles were found and parsed', () => {
            let htmlBodyWithLinkTag =
                htmlBody
                    .replace('An awesome site!',
                    '<link rel="stylesheet" href="style.css/">' +
                    '<link rel="stylesheet" href="' + url + 'public/style.css/">'
                );

            return collector
                .seekStyles(htmlBodyWithLinkTag)
                .then((data) => {
                    expect(data).to.deep.equal(
                        {
                            parsed: [],
                            notParsed: [
                                url + 'style.css/',
                                url + 'public/style.css/'
                            ]
                        }
                    );
                });
        });

    });

    describe('validate() method', ()=> {
        it('should respond with an error if url is empty', () => {
            errorObj.error = 'An empty url is not a url at all :(';

            collector.collect(req, res);
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith(errorObj);
        });

        it('should respond with an error if url is invalid', () => {
            req.query.url  = 'WRONG_URL';
            errorObj.error = 'Wrong url :(';

            collector.collect(req, res);
            expect(res.status).to.be.calledWith(400);
            expect(res.json).to.be.calledWith(errorObj);
        });
    });

});
