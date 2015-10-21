'use strict';

let collector = {
    collect: (req, res) => {
        res.json({res: 'Collect selectors'});
    }
}

module.exports = collector;
