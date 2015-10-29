var chai            = require('chai');
var sinon           = require('sinon');
var sinonChai       = require('sinon-chai');
var chaiAsPromised  = require('chai-as-promised');

global.expect = chai.expect;
global.sinon = sinon;
chai.use(sinonChai);
chai.use(chaiAsPromised);