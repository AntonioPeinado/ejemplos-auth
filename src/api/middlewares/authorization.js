const jwt = require('../jwt');
module.exports = (config) => async (req, res, next) => {
    const auth = req.get('Authorization');
    if (!auth || !auth.includes('Bearer ')) {
        res.status(401).end();
        return;
    }
    const token = auth.split(' ')[1];
    // comprobar que el token no esta en nuestra lista de tokens invalidos
    let payload;
    try {
        payload = await jwt.verify(token, config.authentication.authSecret);
    } catch (err) {
        res.status(401).end();
        console.error(err);
        return;
    }
    req.user = payload.user;
    next();
}