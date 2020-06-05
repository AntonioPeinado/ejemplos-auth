const uuid = require('uuid');
const bcrypt = require('bcrypt');

module.exports = (api, dbManager) => {
    api.post('/register', async (req, res) => {
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
    });
}