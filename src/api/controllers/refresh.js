module.exports = (api, dbManager, sessionManager) => {
    api.post('/refresh', (req, res) => {
        if (!sessionManager.canRefresh(req.cookies.refreshToken)) {
            res.status(401).end();
            return;
        }
        const { authToken, refreshToken } = sessionManager.refresh(req.cookies.refreshToken);
        sessionManager.remove(req.cookies.authToken, req.cookies.refreshToken);
        res.cookie('authToken', authToken, {
            httpOnly: true,
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
        }).status(200).end();
    })
}