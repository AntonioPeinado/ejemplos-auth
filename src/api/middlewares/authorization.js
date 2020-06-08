const jwt = require('../jwt');
module.exports = (config) => async (req, res, next) => {
    const auth = req.get('Authorization');
    if (!auth.includes('Bearer ')) {
        res.status(401).end();
        return;
    }
    const token = auth.split(' ')[1];
    let payload;
    try {
        payload = await jwt.verify(token, config.authentication.authSecret);
    } catch (err) {
        res.status(401).end();
        console.error(err);
    }
    req.user = payload.user;
    next();
}