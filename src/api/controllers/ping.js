// cada controlador es responsable de registrarse en la api
module.exports = (api) => {
    api.get('/ping', (req,res,next) => {
        res.status(200).send('pong');
        next();
    })
}