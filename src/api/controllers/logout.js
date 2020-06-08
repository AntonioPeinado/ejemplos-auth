module.exports = (api) => {
    api.post('/logout', (req, res) => {
        // guardar en una base de datos que tanto el token
        // de autorizacion como el de refresco son inválidos
        res.clearCookie('refresh', {
            httpOnly: true,
            sameSite: 'none'
        }).status(204).end();
    });
}