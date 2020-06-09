module.exports = (app, svc, jwt) => {
    app.post('/useraccount/authenticate', (req, res) => {
        const { login, password } = req.body;
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end();
            return
        }
        svc.validatePassword(login, password)
            .then(async authenticated => {
                const user = await svc.dao.getByLogin(login.trim());
                if (!authenticated || !user.isconfirmed) return res.status(401).end();
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e);
                res.status(500).end();
            });
    });
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
    app.post('/useraccount/inscription', async (req, res) => {
        try{
            const user = req.body;
            const users = await svc.dao.getAll();
            const used = users.filter ( x => x.login == user.login );
            if( used.length !== 0 ) return res.status(409).end();
            svc.insert(user.displayname, user.login, user.password, user.isConfirmed).then( _ =>{
                jwt.inscriptionMail(user);
                return res.status(200).end();
            })
        }catch (e) {
            console.log(e)
        }
    });
    app.get('/useraccount/resend/:login', async (req, res) =>{
        try{
            console.log('là')
            const user = await svc.dao.getByLogin(req.params.login);
            console.log('ici')
            console.log('USER',user)
            if (!(!!user)) return res.status(404).end();
            if(user.isconfirmed) return res.status(401).end();
            await jwt.inscriptionMail(user);
            return res.status(200).end();
        }catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    });
    app.get('/useraccount/confirmation/:token', async (req, res) => {
        try{
        const token = req.params.token;
        const user = await jwt.validationMail(token, res);
        svc.dao.confirm(user.id).then(res.redirect('http://localhost:63342/front/index'))
        }catch (e) {
            console.log(e);
            res.status(500).end;
        }
    });
};