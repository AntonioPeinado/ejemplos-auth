const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const db = require('./db');
const DBManager = require('./db-manager');
const SessionManager = require('./session-manager');
const controllers = require('./controllers');
const sessionTokenAuth = require('./middlewares/session-token-auth');

const dbManager = new DBManager(db);
const sessionManager = new SessionManager(new NodeCache(), {
    authTTL: 15 * 60,
    refreshTTL: 30 * 60
});

// como crear una sub-app de express
const router = express.Router();
// permite interpretar application/json
router.use(bodyParser.json());
// permite interpretar from/xxx-url-encoded
router.use(bodyParser.urlencoded({ extended: true }));
// facilita el manejo de las cookies
router.use(cookieParser());
// middleware para securizar la api usando tokens de sesion
router.use(sessionTokenAuth(dbManager, sessionManager));
// registramos todos los controladores de nuestra api

controllers.forEach((controller) => {
    controller(router, dbManager, sessionManager);
});

module.exports = router;