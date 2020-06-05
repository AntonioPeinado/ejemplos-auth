const bcrypt = require('bcrypt');

module.exports = (api, dbManager, sessionManager) => {
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
        const { authToken, refreshToken } = sessionManager.create(user.id);
        res.cookie('authToken', authToken, {
            httpOnly: true,
            // sameSite: 'strict'
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // sameSite: 'strict'
        }).json(user);
    });
}