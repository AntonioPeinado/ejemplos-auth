module.exports = (dbManager, sessionStore) => (req,res,next) => {
    if(req.path === '/users/login'){
        next();
        return;
    }
    const session = req.cookies.session;
    // no tiene cookie o no esta guardada
    if(!session || !sessionStore[session]){
        res.status(401).send('Vete al login').end();
        return;
    }
    const userId = sessionStore[session];
    const user = dbManager.getById('users', userId);
    req.user = user;
    next();
}