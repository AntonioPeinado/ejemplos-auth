const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const controllers = require('./controllers');
const sessionTokenAuth = require('./middlewares/session-token-auth');
// crear un middleware que podremos registrar en la app de express
// y podemos cofigurar de forma mas especifica
const api = (dbManger, sessionStore) => {
    // como crear una sub-app de express
    const router = express.Router();
    // permite interpretar application/json
    router.use(bodyParser.json());
    // facilita el manejo de las cookies
    router.use(cookieParser());
    // middleware para securizar la api usando tokens de sesion
    router.use(sessionTokenAuth(dbManger, sessionStore));
    // registramos todos los controladores de nuestra api
    controllers.forEach((controller) => {
        controller(router, dbManger, sessionStore);
    });
    
    return router;
}

module.exports = api;