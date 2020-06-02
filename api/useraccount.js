module.exports = (app, svc, jwt) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body;
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end();
            return
        }
        app.get("/useraccount", jwt.validateJWT, async (req, res) => {
            try {
                const user = await svc.dao.getAll(req.user.id);
                if (!(!!user)) return res.status(404).end();
                return res.json(user);
            }
            catch (e) {
                console.log(e);
                res.status(400).end();
            }
        });
        svc.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end();
                    return;
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e);
                res.status(500).end();
            });
    });
};