'use strict';
var express = require('express');

class Bootstrap {

    launch() {
        this.app = express();
        this.app.listen(3300, this.launchCallback);
        return this.app;
    }

    launchCallback(err) {
        if (err) {
            throw new ReferenceError('Could not launch');
        }

        console.log('Server is up at http://localhost:3300');
    }
}

module.exports = Bootstrap;
