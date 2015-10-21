'use strict';
let proxyquire  = require('proxyquire');
let collector;
let req;
let res;
let errorObj;
let requestStub;

describe('Collector', () => {

    describe('collect() method', () => {
        requestStub = sinon.stub();

        collector = proxyquire('../../../routes/collector', {
            request: requestStub
        });
        beforeEach(() => {
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
                status: '400',
                error:  ''
            };
        });

        it('should be defined', () => {
            expect(collector.collect).to.not.be.undefined;
        });

        it('should respond with an error if url is empty', () => {
            errorObj.error = 'An empty url is not an url at all :(';

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

        it('should fire a request if url is correct', function() {
            req.query.url = 'http://theprotein.io';

            collector.collect(req, res);
            expect(requestStub).to.be.calledWith('http://theprotein.io', sinon.match.func);

        });

    });

});
