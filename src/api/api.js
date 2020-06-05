const express = require('express');
const NodeCache = require('node-cache');
const cors = require('cors');
const corsGate = require('cors-gate');
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
const router = express.Router();
// aquellas peticiones que no tengan origin utilizaran el origin del referrer
// si alguien utiliza referrer-policy no-referrer para esas peticiones no quedara
// mas remedio que cancelarlas
router.use(corsGate.originFallbackToReferrer());
router.use(cors({
    origin: ["https://www.google.com"],
    credentials: true
}));
router.use(corsGate({
    strict: true,
    allowSafe: false,
    // the origin of the server
    origin: 'http://localhost:3000'
}));

controllers.public.forEach((controller) => {
    controller(router, dbManager, sessionManager);
});
router.use(sessionTokenAuth(dbManager, sessionManager));
controllers.private.forEach((controller) => {
    controller(router, dbManager, sessionManager);
});

module.exports = router;