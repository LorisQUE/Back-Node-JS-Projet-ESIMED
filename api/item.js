module.exports = (app, serviceItem, jwt) => {
    app.get("/items/:id", jwt.validateJWT, async (req, res) => {
        try {
            res.json(await serviceItem.dao.getAllFromList(req.params.id, req.user.id));
        }
        catch (e) {
            res.status(500).end()
        }
    })

    app.post("/item", jwt.validateJWT, (req, res) => {
        const item = req.body;
        if (!serviceItem.isValid(item))  {
            return res.status(400).end()
        }
        serviceItem.dao.insert(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.get("/items", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getAll(req.user.id);
            if (item === undefined) {
                return res.status(404).end()
            }
            return res.json(item)
        } catch (e) { res.status(400).end() }
    })

    app.get("/item/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id, req.user.id);
            if (item === undefined || item.length == 0) return res.status(404).end();
            res.json(item);
        }
        catch (e) { res.status(400).end(); }
    })

    app.delete("/item/:id", jwt.validateJWT, async (req, res) => {
        try {
            const item = await serviceItem.dao.getById(req.params.id, req.user.id)
            if (item === undefined || item.length == 0) {
                return res.status(404).end()
            }
            serviceItem.dao.delete(req.params.id)
                .then(res.status(200).end())
                .catch(e => {
                    res.status(500).end()
                })
        }
        catch (e) { res.status(400).end(); }
    })

    app.put("/item", jwt.validateJWT, async (req, res) => {
        const item = req.body;
        if ((item.id === undefined) || (item.id == null) || (!serviceItem.isValid(item))) {
            return res.status(400).end()
        }
        if (await serviceItem.dao.getById(item.id, req.user.id) === undefined) {
            return res.status(404).end()
        }
        serviceItem.dao.update(item)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
