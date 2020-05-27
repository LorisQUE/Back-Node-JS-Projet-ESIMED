const BaseDAO = require('./basedao')

module.exports = class ItemDAO extends BaseDAO {
    constructor(db) {
        super(db, 'item')
    }

    insert(item) {
        return this.db.query("INSERT INTO item(quantite, label, ischecked, listid) VALUES ($1,$2,$3,$4)",
            [item.quantite, item.label, item.ischecked, item.listid])
    }

    getAllFromList(listId, userid) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT item.id, quantite, item.label, ischecked, listid FROM item INNER JOIN list ON  listid = list.id WHERE listid = $1 AND useraccountid = $2",[listId, userid])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    getAll(userid) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT item.id, quantite, item.label, ischecked, listid FROM item INNER JOIN list ON listid = list.id WHERE useraccountid = $1",[userid])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    update(item) {
        return this.db.query("UPDATE item SET quantite=$2, label=$3, isChecked=$4, listid=$5 WHERE id=$1",
            [item.id, item.quantite, item.label, item.ischecked, item.listid])
    }

    getById(id){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT id, quantite, label, ischecked, listid FROM item WHERE id = ${id}`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
}