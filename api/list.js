module.exports = (app, serviceList, jwt) => {
    app.get("/list", jwt.validateJWT, async (req, res) => {
        try {
            console.log('req',req.user)
            res.json(await serviceList.dao.getAll(req.user))
        }
        catch (e) {
            console.log(e);
            res.status(500).end()
        }
    })

    app.post("/list", jwt.validateJWT, (req, res) => {
        const list = req.body;
        list.useraccountid = req.user.id;
        console.log(list, serviceList.isValid(list))
        if (!serviceList.isValid(list))  {
            return res.status(400).end()
        }
        serviceList.dao.insert(list)
            .then(res.status(200).end())
            .catch(e => {
                res.status(500).end()
            })
    })

    app.get("/list/:id", jwt.validateJWT, async (req, res) => {
        try {
            const list = await serviceList.dao.getById(req.params.id, req.user.id);
            console.log(list)
            if (list == undefined || list.length == 0) return res.status(404).end();
            return res.json(list);
        }
        catch (e) { res.status(400).end(); }
    })

    app.delete("/list/:id", jwt.validateJWT, async (req, res) => {
        const list = await serviceList.dao.getById(req.params.id, req.user.id);
        if (list === undefined || list.length == 0) {
            return res.status(404).end()
        }
        serviceList.dao.delete(req.params.id)
            .then(res.status(200).end())
            .catch(e => {
                res.status(500).end()
            })
    })

    app.put("/list", jwt.validateJWT, async (req, res) => {
        const list = req.body;
        console.log('liste', list)
        if ((list.id === undefined) || (list.id == null) || (!serviceList.isValid(list))) return res.status(400).end();
        if (await serviceList.dao.getById(list.id, req.user.id) === undefined) {
            return res.status(404).end()
        }
        serviceList.dao.update(list)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })
}
