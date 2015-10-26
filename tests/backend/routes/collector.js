'use strict';
let proxyquire  = require('proxyquire');
let Collector;
let collector;
let req;
let res;
let errorObj;
let requestStub;

describe('Collector', () => {

    beforeEach(() => {
        requestStub = sinon.stub();

        Collector = proxyquire('../../../routes/collector', {
            request: requestStub
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

    describe('collect() method', () => {

        it('should be defined', () => {
            expect(collector.collect).to.not.be.undefined;
        });

        it('should validate url', () => {
            sinon.spy(collector, 'validate');

            collector.collect(req, res);
            expect(collector.validate).to.be.called;
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
