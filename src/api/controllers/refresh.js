module.exports = (api) => {
    api.post('/refresh', async (req, res) => {
        const token = req.cookies.refresh;
        if(!token){
            res.status(401).end();
            return;
        }
        // comprobar si el token esta en nuestra lista de tokens invalidos
        const authToken = await req.$.authManager.refresh(token);
        if(!authToken){
            res.status(401).end();
            return;
        }
        res.status(200).json({token:authToken});
    })
}