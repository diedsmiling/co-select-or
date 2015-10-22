'user strict';
let Collector = require('./collector');

module.exports.init = (app) => {
    let collector = new Collector();
    app.get('/collector', collector.collect);

};
