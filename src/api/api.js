const express = require('express');
const cors = require('cors');
const corsGate = require('cors-gate');
const util = require('../util');
const db = require('./db');
const DBManager = require('./db-manager');
const controllers = require('./controllers');
const authorization = require('./middlewares/authorization');
const dbManager = new DBManager(db);

function api(config) {
    const router = express.Router();
    // aquellas peticiones que no tengan origin utilizaran el origin del referrer
    // si alguien utiliza referrer-policy no-referrer para esas peticiones no quedara
    // mas remedio que cancelarlas
    router.use(corsGate.originFallbackToReferrer());
    router.use(cors({
        origin: config.allowedOrigins,
        credentials: true
    }));
    router.use(corsGate({
        strict: true,
        allowSafe: false,
        origin: util.getOrigin(config)
    }));

    controllers.public.forEach((controller) => {
        controller(router, dbManager, config);
    });
    router.use(authorization(config));
    controllers.private.forEach((controller) => {
        controller(router, dbManager, config);
    });
    return router;
}

module.exports = api;