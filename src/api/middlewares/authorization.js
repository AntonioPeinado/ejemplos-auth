module.exports = async (req, res, next) => {
    const auth = req.get('Authorization');
    if (!auth || !auth.includes('Bearer ')) {
        res.status(401).end();
        return;
    }
    const token = auth.split(' ')[1];
    // comprobar que el token no esta en nuestra lista de tokens invalidos
    const user = await req.$.authManager.verify(token);
    if(!user){
        res.status(401).end();
        return;
    }
    req.$.user = user;
    next();
}