'use strict';
let request     = require('request');
let nock        = require('nock');
let proxyquire  = require('proxyquire');
let Collector;
let collector;
let req;
let res;
let errorObj;

describe('Collector', () => {

    beforeEach(() => {

        sinon.spy(request, 'get');

        Collector = proxyquire('../../../routes/collector', {
            request: request
        });

        res = {
            json:   sinon.spy(),
            status: sinon.spy()
        };

        req = {
            query: {
                url: ''
            }
        };

        errorObj = {
            status: 400,
            error:  ''
        };

        collector = new Collector();
    });

    afterEach(() => {
        request.get.restore();
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
            req.query.url = 'http://theprotein.io';

            collector.collect(req, res);
            expect(collector.doRequest).to.be.called;
        });
    });

    describe('doRequest() method', () => {
        it('should be defined', () => {
            expect(collector.doRequest).to.not.be.undefined;
        });

        it('should make a request', () => {
            nock('http://theprotein.io')
                .get('/')
                .reply(200, {
                    username: 'davidwalshblog',
                    firstname: 'David'
                });

            collector.doRequest('http://theprotein.io');
            expect(request.get).to.be.called;
        });

        it('should handle an error', () => {
            nock('http://theprotein.io')
                .get('/')
                .replyWithError(404);
            collector.doRequest('http://theprotein.io');

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
