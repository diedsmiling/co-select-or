'use strict';
let request     = require('request');
let nock        = require('nock');
let proxyquire  = require('proxyquire');

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

let Collector;
let collector;

describe('Collector', () => {

    beforeEach(() => {

        sinon.spy(request, 'get');

        Collector = proxyquire('../../../routes/collector', {
            request: request
        });
        collector = new Collector();

        // Mocking http requests
        nock('http://theprotein.io')
            .get('/')
            .reply(200);

        nock('http://missingurl.io')
            .get('/')
            .replyWithError(404);
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
            collector.doRequest('http://theprotein.io');
            expect(request.get).to.be.called;
        });

        it('should reject on request error', () => {
            return expect(collector.doRequest('http://missingurl.io/')).to.be.rejected;
        });

        it('should resolve on valid request', () => {
            return expect(collector.doRequest('http://theprotein.io/')).to.be.resolved;
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
