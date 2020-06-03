const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const controllers = require('./controllers');
const sessionTokenAuth = require('./middlewares/session-token-auth');
// crear un middleware que podremos registrar en la app de express
// y podemos cofigurar de forma mas especifica
const api = (dbManger, sessionStore) => {
    const router = express.Router();
    router.use(bodyParser.json());
    router.use(cookieParser());
    router.use(sessionTokenAuth(dbManger, sessionStore));
    controllers.forEach((controller) => {
        controller(router, dbManger, sessionStore);
    });
    return router;
}

module.exports = api;