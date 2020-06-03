module.exports = (dbManager, sessionStore) => (req,res,next) => {
    // si el path es /users/login no comprobamos nada
    const isLogin = req.path === '/users/login';
    const isRegister = req.path === '/users' && req.method === 'POST';
    if(isLogin || isRegister){
        next();
        return;
    }
    // cogemos el token de la cookie de session
    const session = req.cookies.session;
    // no tiene cookie o no esta guardada
    if(!session || !sessionStore[session]){
        res.status(401).end();
        // podemos mandar el 401 y que gestione el cliente
        // o podemos redirigar a la pagina de login
        return;
    }
    // grabando el usuario en la request para tener acceso desde los controladores
    const userId = sessionStore[session];
    const user = dbManager.getById('users', userId);
    req.user = user;
    // y siguiente
    next();
}