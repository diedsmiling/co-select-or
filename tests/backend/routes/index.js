'use strict';
let routes      = require('../../../routes');
let collector   = require('../../../routes/collector');
let app;
let req;
let res;

describe('Routes', () => {

    beforeEach(() => {
        app = {
            get: sinon.spy()
        };

        routes.init(app);
    });

    it('should handle "/api/v1/selectors" request', () => {
        expect(app.get).to.be.calledWith('/collector', collector.collect);
    });

});
