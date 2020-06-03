const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cada controlador es responsable de registrarse en la api
module.exports = (api, dbManager, sessionStore) => {
    api.get('/users/:id', (req, res, next) => {
        const id = req.params.id;
        const user = dbManager.getById('users', id);
        if (!user) {
            res.status(404).end();
            next();
            return;
        }
        res.json(user);
        next();
    })
    api.post('/users', async (req, res, next) => {
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
        const user = dbManager.find('users', (user) => user.email === email);
        if(!user){
            res.status(401).end();
            next();
            return;
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if(!isCorrectPassword){
            res.status(401).end();
            next();
            return;
        }
        const sessionToken = uuid.v4();
        sessionStore[sessionToken] = user.id;
        res
            .cookie('session', sessionToken, {
                maxAge: 1 * 60 * 60 * 1000,
                httpOnly: true,
            })
            .status(200)
            .end();
        next();
    })
}