module.exports = (app, serviceList, jwt) => {
    app.get("/list", jwt.validateJWT, async (req, res) => {
        try {
            res.json(await serviceList.dao.getAll(req.user))
        }
        catch (e) {
            console.log(e);
            res.status(500).end()
        };
    });

    app.post("/list", jwt.validateJWT, (req, res) => {
        const list = req.body;
        list.useraccountid = req.user.id;
        if (!serviceList.isValid(list))  {
            return res.status(400).end()
        }
        serviceList.dao.insert(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            });
    });

    app.get("/list/:id", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getById(req.params.id);
            if (list == undefined || list.length == 0) return res.status(404).end();
            if (list[0].useraccountid !== req.user.id) return res.status(403).end();
            return res.json(list[0]);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        };
    });

    app.get("/listPartage/:id", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getPartageById(req.params.id);
            if (!(!!list)) return res.status(404).end();
            if (list.user_id !== req.user.id) return res.status(403).end();
            return res.json(list);
        }
        catch (e) {
            console.log(e);
            res.status(400).end();
        };
    });

    app.delete("/list/:id", jwt.validateJWT, async (req, res) => {
        const list = await serviceList.dao.getById(req.params.id);
        if (list === undefined || list.length == 0) return res.status(404).end();
        if (list[0].useraccountid !== req.user.id) return res.status(403).end();
        serviceList.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end()
            });
    });

    app.put("/list", jwt.validateJWT, async (req, res) => {
        const list = req.body;
        const originalList = await serviceList.dao.getById(req.body.id);
        if ((list.id === undefined) || (list.id == null) || (!serviceList.isValid(list))) return res.status(400).end();
        if (await serviceList.dao.getById(list.id) === undefined) return res.status(404).end();
        if (originalList[0].useraccountid !== req.user.id) return res.status(403).end();
        serviceList.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e);
                res.status(500).end();
            });
    });
};
