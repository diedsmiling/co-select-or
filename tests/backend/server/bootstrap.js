'use strict';
let proxyquire = require('proxyquire');
let expressStub;
let app;
let Bootstrap;
let launcher;

describe('Bootstrap', ()=> {
    beforeEach(()=> {
        app = {
            listen: sinon.stub()
        };

        expressStub = sinon.stub().returns(app);
        Bootstrap = proxyquire('../../../server/bootstrap', {
            express: expressStub
        });
    });
    describe('launch() method', ()=> {

        beforeEach(() => {
            sinon.spy(console, 'log');
            launcher = new Bootstrap();
            launcher.launch();
        });

        afterEach(function() {
            console.log.restore();
        });

        it('should be defined', ()=> {
            expect(launcher.launch).to.not.be.undefined;
        });

        it('should create express() app', () => {
            expect(expressStub).to.be.called;
        });

        it('should launch the app', ()=> {
            expect(app.listen).to.be.calledWith(3300, sinon.match.func);
        });

        it('should log to console', ()=> {
            launcher.launchCallback();
            expect(console.log).to.be.called;
        });

        it('Should throw an error', () => {
            expect(() => {
                launcher.launchCallback('err');
            })
            .to.throw(Error);
        });
    });

});
