const uuid = require('uuid');
const bcrypt = require('bcrypt');

// cada controlador es responsable de registrarse en la api
module.exports = (api, dbManager, sessionManager) => {
    api.post('/users', async (req, res, next) => {
        // hashear la contrasena porque no podemos guardarlas en plano en la base
        // de datos. El salt es el nivel de encriptación.
        const password = await bcrypt.hash(req.body.password, 10);
        const user = {
            ...req.body,
            id: uuid.v4(),
            password
        }
        dbManager.create('users', user);
        res.status(201).json(user);
        next();
    });
    api.post('/users/login', async (req, res, next) => {
        const { email, password } = req.body;
        // buscamos el usuairo por email (tendría que ser único)
        const user = dbManager.find('users', (user) => user.email === email);
        // si no se encontró usuario con ese email devolvemos un 401
        // no devolvemos un 404 para no dar informacion sobre qué campo es erroneo.
        if (!user) {
            res.status(401).end();
            next();
            return;
        }
        // comparamos el hash generado por bcrypt con la contraseña introducida
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        // si no coinciden las contraseñas 401
        if (!isCorrectPassword) {
            res.status(401).end();
            next();
            return;
        }
        // antes de crear el nuevo token podríamos invalidar el anterior en función
        // del id de usuario
        const {authToken, refreshToken} = sessionManager.create(user.id);
        res
            .cookie('authToken', authToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            .json(user)
            .end();
        next();
    });
    api.post('/users/logout', (req, res) => {
        sessionManager.remove(req.cookies.authToken, req.cookies.refreshToken);
        res.status(200).end();
    });
    api.post('/users/refresh', (req, res) => {
        if(!sessionManager.canRefresh(req.cookies.refreshToken)){
            res.status(401).end();
            return;
        }
        const {authToken, refreshToken} = sessionManager.refresh(req.cookies.refreshToken);
        sessionManager.remove(req.cookies.authToken, req.cookies.refreshToken);
        res
            .cookie('authToken', authToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            .status(200)
            .end();
    })
}