const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fallback = require('express-history-api-fallback');
const helmet = require('helmet');
const util = require('./util');
const api = require('./api/api');

function createServer(config) {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use('/api', api(config));
    app.use(
        helmet.contentSecurityPolicy(config.csp),
        helmet.referrerPolicy({
            policy: config.referrerPolicy
        }),
        helmet({
            hidePoweredBy: true
        }),
        express.static(config.staticPath),
        fallback('index.html', { root: config.staticPath })
    );
    app.listen(config.port, () => {
        console.log(`server listening on ${util.getOrigin(config)}`);
    });
    return app;
}

module.exports = {
    create: createServer
};