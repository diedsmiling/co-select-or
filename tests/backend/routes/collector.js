'use strict';
let collector = require('../../../routes/collector');
let req;
let res;
let errorObj;

describe('Collector', () => {

    describe('collect() method', () => {
        beforeEach(() => {
            res = {
                json: sinon.spy()
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
            console.log(errorObj);

            collector.collect(req, res);
            expect(res.json).to.be.calledWith(errorObj);
        });

        it('should respond with an error if url is invalid', () => {
            req.query.url  = 'WRONG_URL';
            errorObj.error = 'Wrong url :(';

            collector.collect(req, res);
            expect(res.json).to.be.calledWith(errorObj);
        });

    });

});
