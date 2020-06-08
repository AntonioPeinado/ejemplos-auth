const jwt = require('../jwt');

module.exports = (api, dbManager, config) => {
    api.post('/refresh', async (req, res) => {
        const token = req.cookies.refresh;
        if(!token){
            res.status(401).end();
            return;
        }
        // comprobar si el token esta en nuestra lista de tokens invalidos
        try {
            const payload = await jwt.verify(token, config.authentication.refreshSecret);
            const authToken = await jwt.sign({user:payload.user}, config.authentication.authSecret, {
                algorithm: 'HS512',
                expiresIn: config.authentication.authTTL
            });
            res.status(200).json({token:authToken});
        } catch (err){
            res.status(401).end();
            return;
        }
    })
}