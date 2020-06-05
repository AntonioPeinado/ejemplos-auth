module.exports = (dbManager, sessionManager) => (req, res, next) => {
    // no tiene cookie o no esta guardada
    if (!sessionManager.isAuthorized(req.cookies.authToken)) {
        res.status(401).end();
        return;
        // podemos mandar el 401 y que gestione el cliente
        // o podemos redirigar a la pagina de login
    }
    // grabando el usuario en la request para tener acceso desde los controladores
    const userId = sessionManager.getUserId(req.cookies.authToken);
    const user = dbManager.getById('users', userId);
    req.user = user;
    // y siguiente
    next();
}