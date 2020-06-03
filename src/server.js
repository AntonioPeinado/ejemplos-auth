const express = require('express');
const db = require('./db');
const DBManager = require('./db-manager');
const sessionStore = {};
const api = require('./api/api');
// crea un servidor de express
const app = express();
const dbManager = new DBManager(db);
// para la ruta /api utiliza el middleware api
app.use('/api', api(dbManager, sessionStore));

// hace que el servidor escuche peticiones en el puerto 3000
app.listen(3000, () => {
    console.log('server listening on http://localhost:3000');
});