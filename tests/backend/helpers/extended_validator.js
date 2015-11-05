'use strict';
let proxyquire  = require('proxyquire');
let util        = require('util');
let validator   = require('validator');
let extendedValidator;

sinon.spy(util, '_extend');
extendedValidator   = proxyquire('../../../helpers/extended_validator', {
    util:       util,
    validator:  validator
});

describe('Extended validator', () => {
    it('should inherit validator module', ()=> {
        expect(util._extend).to.be.calledWith(sinon.match.object, validator);
    });

    describe('isRelativeUrl', () => {
        it('should be defined', () => {
            expect(extendedValidator.isRelativeUrl).to.not.be.undefined;
        });

        it('should check if url is relative', ()=> {
            expect(extendedValidator.isRelativeUrl('style.css')).to.equal(true);
            expect(extendedValidator.isRelativeUrl('/public/style.css')).to.equal(true);
            expect(extendedValidator.isRelativeUrl('public/style.css')).to.equal(true);

            expect(extendedValidator.isRelativeUrl('//cdn.google.com/public/style.css')).to.equal(false);
            expect(extendedValidator.isRelativeUrl('http://google.com/public/style.css')).to.equal(false);
            expect(extendedValidator.isRelativeUrl('https://.google.com/public/style.css')).to.equal(false);
        });
    });
});
