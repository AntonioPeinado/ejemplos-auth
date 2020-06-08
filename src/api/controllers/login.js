const bcrypt = require('bcrypt');
const jwt = require('../jwt');

module.exports = (api, dbManager, config) => {
    api.post('/login', async (req, res) => {
        const { email, password } = req.body;
        // buscamos el usuairo por email (tendría que ser único)
        const user = dbManager.find('users', (user) => user.email === email);
        // si no se encontró usuario con ese email devolvemos un 401
        // no devolvemos un 404 para no dar informacion sobre qué campo es erroneo.
        if (!user) {
            res.status(401).end();
            return;
        }
        // comparamos el hash generado por bcrypt con la contraseña introducida
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        // si no coinciden las contraseñas 401
        if (!isCorrectPassword) {
            res.status(401).end();
            return;
        }
        const userModel = {
            ...user,
            password: undefined
        };
        const authToken = await jwt.sign({user:userModel}, config.authentication.authSecret, {
            algorithm: 'HS512',
            expiresIn: config.authentication.authTTL
        });
        const refreshToken = await jwt.sign({user:userModel}, config.authentication.refreshSecret, {
            algorithm: 'HS512',
            expiresIn: config.authentication.refreshTTL
        });
        res.status(200)
            .cookie('refresh', refreshToken, {
                maxAge: config.authentication.refreshTTL * 1000,
                httpOnly: true,
                sameSite: 'none'
            })
            .json({token: authToken});
    });
}