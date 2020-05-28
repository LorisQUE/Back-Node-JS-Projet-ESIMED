module.exports = (app, servicePartage, serviceList, serviceUser, jwt) => {

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
    app.get("/partageUser/:id", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getAllByUserId(req.params.id);
            //const list = await serviceList.dao.getById(partage[0].list_id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            //if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    //Get tout les partages avec une liste --> 'Voir à qui a été partagée cette liste'
    app.get("/partageList/:id", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getAllByListId(req.params.id);
            //const list = await serviceList.dao.getById(partage[0].list_id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            //if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    //Get ONE By Id
    app.get("/partage/:id", jwt.validateJWT, async (req, res) => {
        try {
            const partage = await servicePartage.dao.getById(req.params.id);
            const list = await serviceList.dao.getById(partage[0].list_id);
            if (partage == undefined || partage.length == 0) return res.status(404).end();
            if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(partage);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        }
    });

    app.post("/partage", jwt.validateJWT, async (req, res) => {
        const partage = req.body;
        const list = await serviceList.dao.getById(partage.list_id);
        const user = await serviceUser.dao.getById(partage.user_id);
        const checking = await servicePartage.dao.checkExisting(partage.user_id, partage.list_id);
        //Si l'id est null ou que le partage est invalide ou que la ligne existe -> erreur 400
        if (!servicePartage.isValid(partage) || !!checking[0] ) return res.status(400).end();
        //Si la liste ou l'user n'existe pas -> erreur 404
        if (!(!!list[0]) || !(!!user[0])) return res.status(404).end();
        //Si la liste n'est pas a l'user ou s'il se partage à lui même -> 403
        if (list[0].useraccountid !== req.user.id || partage.user_id == req.user.id) return res.status(403).end();
        servicePartage.dao.insert(partage)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            })
    });

    app.delete("/partage/:id", jwt.validateJWT, async (req, res) => {
        const partage = await servicePartage.dao.getById(req.params.id);
        const list = await serviceList.dao.getById(partage[0].list_id);
        if (partage === undefined || partage.length == 0) return res.status(404).end();
        if (list[0].useraccountid !== req.user.id) return res.status(403).end();
        servicePartage.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            })
    });

    app.put("/partage", jwt.validateJWT, async (req, res) => {
        const partage = req.body;
        const list = await serviceList.dao.getById(partage.list_id);
        const user = await serviceUser.dao.getById(partage.user_id);
        const checking = await servicePartage.dao.checkExisting(partage.user_id, partage.list_id);
        //Si l'id est null ou que le partage est invalide ou que la ligne existe -> erreur 400
        if (!(!!partage.id) || (!servicePartage.isValid(partage)) || (!!checking[0] && checking[0].id !== req.body.id)) return res.status(400).end();
        //Si la liste ou l'user n'existe pas -> erreur 404
        if (!(!!list[0]) || !(!!user[0])) return res.status(404).end();
        //Si la liste n'est pas a l'user ou s'il se partage à lui même -> 403
        if (list[0].useraccountid !== req.user.id || partage.user_id == req.user.id) return res.status(403).end();

        servicePartage.dao.update(partage)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end();
            })
    });
};
