const express = require('express');
const cors = require('cors');
const corsGate = require('cors-gate');
const util = require('../util');
const db = require('./db');
const DBManager = require('./db-manager');
const AuthManger = require('./auth-manager');
const controllers = require('./controllers');
const authorization = require('./middlewares/authorization');

function api(config) {
    const router = express.Router();
    const dbManager = new DBManager(db);
    const authManger = new AuthManger(config.authentication);

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
    router.use((req, res, next) => {
        // así el objeto req que se comparte entre todos los controladores y middlewares
        // tiene acceso a una serie de variables que yo quiero compartir dentro de $
        req.$ = {
            authManger,
            config,
            dbManager
        };
        next();
    })
    controllers.public.forEach((controller) => {
        controller(router);
    });
    router.use(authorization);
    controllers.private.forEach((controller) => {
        controller(router);
    });
    return router;
}

module.exports = api;