module.exports = (api, dbManager, sessionManager) => {
    api.post('/logout', (req, res) => {
        sessionManager.remove(req.cookies.authToken, req.cookies.refreshToken);
        res.status(200).end();
    });
}