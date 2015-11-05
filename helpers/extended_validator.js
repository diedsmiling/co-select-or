'use strict';
var validator   = require('validator');
var extend      = require('util')._extend;
var newValidator = {
    /**
     * Checks if url is relative or absolute
     *
     * @param {str} url
     * @returns {bool}
     */
    isRelativeUrl: (url) => {
        var pat = /^https?:\/\/|^\/\//i;
        if (pat.test(url)) {
            return false;
        }
        return true;
    }
};

var validatorExtended = extend(newValidator, validator);
module.exports = validatorExtended;
