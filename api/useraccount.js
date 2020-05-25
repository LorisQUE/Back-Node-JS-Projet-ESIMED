module.exports = (app, svc, jwt) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body;
        if ((login === undefined) || (password === undefined)) {
            console.log(req.body);
            res.status(400).end();
            return
        }
        svc.validatePassword(login, password)
            .then(authenticated => {
                console.log('login',login,'password', password)
                console.log('authenticated',authenticated)
                if (!authenticated) {
                    res.status(401).end();
                    return;
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e);
                res.status(500).end();
            })

    })
}