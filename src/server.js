const express = require('express');
const api = require('./api/api');
const db = require('./db');
const DBManager = require('./db-manager');
// crea un servidor de express
const app = express();
// esto debería ser una base de datos (keystore)
// en la que se guarde el token de sesion asociado al usuario
const sessionStore = {};
// crear una bd falsa para hacer pruebas
const dbManager = new DBManager(db);
// para la ruta /api utiliza el middleware api
app.use('/api', api(dbManager, sessionStore));

// hace que el servidor escuche peticiones en el puerto 3000
app.listen(3000, () => {
    console.log('server listening on http://localhost:3000');
});