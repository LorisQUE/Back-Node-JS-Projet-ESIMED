module.exports = (app, servicePartage, jwt) => {

    app.post("/partage", jwt.validateJWT, (req, res) => {
        const partage = req.body;
        partage.useraccountid = req.user.id;
        if (!servicePartage.isValid(partage))  {
            return res.status(400).end()
        }
        servicePartage.dao.insert(partage)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            })
    });

    //Get All partages de MES listes
    app.get("/partage", jwt.validateJWT, async (req, res) => {
        try {
            res.json(await servicePartage.dao.getAll(req.user))
        }
        catch (e) {
            console.log(e);
            res.status(500).end()
        }
    });

    //Get toutes les listes partagées avec un user --> 'Les listes qu'on a partagées avec moi'
    app.get("/partage/:user", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getAllBySharedUser(req.params.id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            if (partage[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    //Get tout les partages avec une liste --> 'Voir à qui a été partagée cette liste'
    app.get("/partage/:list", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getAllByList(req.params.id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            if (partage[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    app.get("/partage/:id", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getById(req.params.id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            if (partage[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    app.delete("/partage/:id", jwt.validateJWT, async (req, res) => {
        const partage = await servicePartage.dao.getById(req.params.id);
        if (partage === undefined || partage.length == 0) return res.status(404).end();
        if (partage[0].useraccountid !== req.user.id) return res.status(403).end();
        servicePartage.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            })
    });

    app.put("/partage", jwt.validateJWT, async (req, res) => {
        const partage = req.body;
        const originalPartage = await servicePartage.dao.getById(req.body.id);
        if ((partage.id === undefined) || (partage.id == null) || (!servicePartage.isValid(partage))) return res.status(400).end();
        if (await servicePartage.dao.getById(partage.id) === undefined) return res.status(404).end();
        if (originalPartage[0].useraccountid !== req.user.id) return res.status(403).end();
        servicePartage.dao.update(partage)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end();
            })
    });
};
