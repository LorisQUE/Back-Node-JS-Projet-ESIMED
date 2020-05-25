const BaseDAO = require('./basedao')

module.exports = class ListDAO extends BaseDAO {
    constructor(db) {
        super(db, 'list')
    }
    insert(list) {
        return this.db.query("INSERT INTO list(label, date, isArchived, useraccountid) VALUES ($1,$2,$3, $4)",
            [list.label, list.date, list.isarchived, list.useraccountid])
    }
    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM list WHERE useraccountid = $1 ORDER BY label, date", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }

    update(list) {
        return this.db.query("UPDATE list SET label=$2, date=$3, isArchived=$4 WHERE id=$1",
            [list.id, list.label, list.date, list.isarchived])
    }

    getById(id, userid){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM list WHERE id = ${id} AND useraccountid = ${userid}`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    }
}