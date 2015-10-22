'use strict';
let proxyquire  = require('proxyquire');
let Collector   = require('../../../routes/collector');
let routes      = require('../../../routes');
let app;
let req;
let res;

describe('Routes', () => {

    beforeEach(() => {
        app = {
            get: sinon.stub()
        };

        sinon.spy(Collector.prototype, 'collect');
        app.get.onFirstCall().callsArgWith(1, req, res)
        routes.init(app);

    });

    it('should handle "/collector" request', () => {
        expect(app.get).to.be.calledWith('/collector', Collector.prototype.collect);
    });

});
