const BaseDAO = require('./basedao')

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    }
    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge) VALUES ($1,$2,$3)",
            [useraccount.displayName, useraccount.login, useraccount.challenge])
    }
    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)));
    }

}