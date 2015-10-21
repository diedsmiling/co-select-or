'use strict';
let proxyquire  = require('proxyquire');
let express     = require('express');
let expressStub;
let routesStub;
let app;
let Bootstrap;
let launcher;

/**
 * Checks if a middleware is set up
 *
 * @param {obj} app Application object
 * @param {str} middlewareName Name of the middleware to test
 * @returns {bool}
 */
function isMiddlewareSet(app, middlewareName) {
    var _return = false;
    app._router.stack.filter(function(layer) {
        if (layer.handle.name == middlewareName) {
            _return = true;
        }
    });
    return _return;
}

describe('Bootstrap', ()=> {

    beforeEach(()=> {
        app         = {
            listen: sinon.stub(),
            set:    sinon.spy(),
            get:    sinon.stub().returns(3300),
            use:    sinon.spy()
        };

        routesStub  = {
            init: sinon.stub()
        };

        expressStub = sinon.stub().returns(app);

        Bootstrap   = proxyquire('../../../server/bootstrap', {
            express:        expressStub,
            '../routes/':   routesStub
        });

        launcher    = new Bootstrap();
    });

    describe('launch() method', ()=> {

        it('should be defined', ()=> {
            expect(launcher.launch).to.not.be.undefined;
        });

        it('should create express() app', () => {
            launcher.launch();
            expect(expressStub).to.be.called;
        });

        it('should call configure() method', ()=> {
            sinon.spy(Bootstrap.prototype, 'configure');
            launcher.launch();
            expect(Bootstrap.prototype.configure).to.be.called;
        });

        it('should get the port', ()=> {
            launcher.launch();
            expect(app.get).to.be.calledWith('port');
        });

        it('should launch the app', ()=> {
            launcher.launch();
            expect(app.listen).to.be.calledWith(3300, sinon.match.func);
        });

        it('should log to console', ()=> {
            sinon.spy(console, 'log');
            app.listen.callsArgWith(1, null);
            launcher.launch();

            expect(app.get).to.be.calledWith('port');
            expect(console.log).to.be.calledWith('Server is up at http://localhost:3300');
            console.log.restore();
        });

        it('should throw an error', () => {
            app.listen.callsArgWith(1, 'err');
            expect(() => {
                launcher.launch();
            }).to.throw(Error);
        });
    });

    describe('configure() method (while using expressStub)', () => {

        it('should be defined', () => {
            expect(launcher.configure).to.not.be.undefined;
        });

        it('should set the port', ()=> {
            launcher.launch();
            expect(app.set).to.be.calledWith('port', 3300);
        });

        it('should init routes', () => {
            launcher.launch();
            expect(routesStub.init).to.be.calledWith(launcher.app);
        });
    });

});

describe('Bootstrap without stub', () => {

    beforeEach(() => {
        Bootstrap   = require('../../../server/bootstrap');
        launcher    = new Bootstrap();

        launcher.launch();
        launcher.app.get = sinon.stub().returns('development');
    });

    it('should use "bodyParser.urlencoded" middleware', function() {
        expect(isMiddlewareSet(launcher.app, 'urlencodedParser')).to.equal(true);
    });

    it('should use "errorHandler" middleware in dev env', function() {
        expect(isMiddlewareSet(launcher.app, 'errorHandler')).to.equal(true);
    });

});
