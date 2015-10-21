'use strict';
let express         = require('express');
let bodyParser      = require('body-parser');
let logger          = require('morgan');
let errorHandler    = require('errorhandler');
let routes          = require('../routes/');

class Bootstrap {

    /**
     * Launches the application
     */
    launch() {
        this.app = express();
        this.configure();
        this.app.listen(this.app.get('port'), (err) => {
            if (err) {
                throw new ReferenceError('Could not launch');
            }

            console.log('Server is up at http://localhost:' + this.app.get('port'));
        });
    }

    /**
     * Configures the application
     */
    configure() {
        this.app.set('port', process.env.PORT || 3300);

        //Set up middlewares
        this.app.use(bodyParser.urlencoded({ extended: false }));
        if ('development' === this.app.get('env')) {
            this.app.use(errorHandler());
        }
        routes.init(this.app);
    }
}

module.exports = Bootstrap;
