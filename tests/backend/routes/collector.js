'use strict';
var collector = require('../../../routes/collector');

describe('Collector', () => {

    describe('collect() method', () => {

        it('should be defined', () => {
            expect(collector.collect).to.not.be.undefined;
        });

    });

});