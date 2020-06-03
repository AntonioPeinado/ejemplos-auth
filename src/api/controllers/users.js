const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cada controlador es responsable de registrarse en la api
module.exports = (api, dbManager, sessionStore) => {
    api.post('/users', async (req, res, next) => {
        // hashear la contrasena porque no podemos guardarlas en plano en la base
        // de datos. El salt es el nivel de encriptación.
        // TODO: enterarnos bien de como narices funciona bcrypt
        const password = await bcrypt.hash(req.body.password, saltRounds);
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
        const {email, password} = req.body;
        // buscamos el usuairo por email (tendría que ser único)
        const user = dbManager.find('users', (user) => user.email === email);
        // si no se encontró usuario con ese email devolvemos un 401
        // no devolvemos un 404 para no dar informacion sobre qué campo es erroneo.
        if(!user){
            res.status(401).end();
            next();
            return;
        }
        // comparamos el hash generado por bcrypt con la contraseña introducida
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        // si no coinciden las contraseñas 401
        if(!isCorrectPassword){
            res.status(401).end();
            next();
            return;
        }
        // si el login es correcto generamos un token aleatorio
        const sessionToken = uuid.v4();
        // guardamos en token en la base de datos de sesiones asociandolo al id de usuario
        sessionStore[sessionToken] = user.id;
        // incluimos el token en una cookie con caducidad, httpOnly, etc..
        res
            .cookie('session', sessionToken, {
                maxAge: 1 * 60 * 60 * 1000,
                httpOnly: true,
            })
            .status(200)
            .end();
            // TODO: redireccionar a la app
        next();
    })
}