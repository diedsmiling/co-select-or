'user strict';
let collector = require('./collector');

module.exports.init = (app) => {
    app.get('/api/v1/selectors', collector.collect);
};
