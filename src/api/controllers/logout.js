module.exports = (api) => {
    api.post('/logout', (req, res) => {
        res.clearCookie('refresh').status(204).end();
    });
}