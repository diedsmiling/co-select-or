'use strict';
let proxyquire  = require('proxyquire');
let Bootstrap   = require('../../server/bootstrap');
let server      = () => {
    proxyquire('../../server', {
        './server/bootstrap': Bootstrap
    });
};

describe('Server', ()=> {

    it('should create new bootstrap instance', ()=> {
        Bootstrap = sinon.spy();
        server();
        expect(Bootstrap).to.be.called;
    });

    it('should launch the bootstrap', ()=> {
        sinon.spy(Bootstrap.prototype, 'launch');
        server();
        expect(Bootstrap.prototype.launch).to.be.called;
    });

});
