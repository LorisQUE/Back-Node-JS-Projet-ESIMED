const BaseDAO = require('./basedao')

module.exports = class ListDAO extends BaseDAO {
    constructor(db) {
        super(db, 'list')
    };
    insert(list) {
        return this.db.query("INSERT INTO list(label, date, isArchived, useraccountid) VALUES ($1,$2,$3, $4)",
            [list.label, list.date, list.isarchived, list.useraccountid])
    };
    insertBack(list) {
        return this.db.query("INSERT INTO list(id, label, date, isArchived, useraccountid) VALUES ($1,$2,$3,$4,$5)",
            [list.id, list.label, list.date, list.isarchived, list.useraccountid])
    };
    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM list WHERE useraccountid = $1 ORDER BY label, date", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    };
    update(list) {
        return this.db.query("UPDATE list SET label=$2, date=$3, isArchived=$4 WHERE id=$1",
            [list.id, list.label, list.date, list.isarchived]);
    };
    getById(id){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM list WHERE id = ${id}`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)))
    };
    getPartageById(Listid, UserId){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT list.id, label, date, isarchived, useraccountid, user_id, droit FROM list INNER JOIN partage ON list.id = list_id WHERE list.id = ${Listid} AND user_id = ${UserId}`)
                .then(res => resolve(res.rows[0]))
                .catch(e => reject(e)))
    };
};