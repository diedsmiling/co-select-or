'user strict';
let collector = require('./collector');

module.exports.init = (app) => {
    app.get('/collector', collector.collect);
};
