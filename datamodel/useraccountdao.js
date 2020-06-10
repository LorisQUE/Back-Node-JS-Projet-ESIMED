const BaseDAO = require('./basedao');

module.exports = class UserAccountDAO extends BaseDAO {
    constructor(db) {
        super(db, "useraccount")
    };
    insert(useraccount) {
        return this.db.query("INSERT INTO useraccount(displayname,login,challenge, isConfirmed) VALUES ($1,$2,$3,$4)",
            [useraccount.displayname, useraccount.login, useraccount.challenge, useraccount.isConfirmed])
    };
    update(useraccount) {
        return this.db.query("UPDATE useraccount SET displayname=$2, login=$3 WHERE id=$1",
            [useraccount.id, useraccount.displayname, useraccount.login]);
    };
    updatePassword(useraccount) {
        return this.db.query("UPDATE useraccount SET challenge=$2 WHERE id=$1",
            [useraccount.id, useraccount.challenge]);
    };
    confirm(id){
        return this.db.query("UPDATE useraccount SET isConfirmed=true WHERE id=$1",
            [id]);
    }
    getAllBesidesCurrent(id){ //Get all sauf user en cours
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id, displayname, login, isConfirmed FROM useraccount WHERE id <> $1", [id])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)));
    };
    getAllConfirmed(id){ //Get all sauf user en cours
        return new Promise((resolve, reject) =>
            this.db.query("SELECT id, displayname, login, isConfirmed FROM useraccount WHERE id <> $1 AND isconfirmed = true", [id])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)));
    };
    getAll(){  //Get all (utiliser pour vérifier le login)
        return new Promise((resolve, reject) =>
        this.db.query("SELECT * FROM useraccount")
            .then(res => resolve(res.rows) )
            .catch(e => reject(e)));
    }
    getByLogin(login) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM useraccount WHERE login=$1", [ login ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)));
    };
    getById(id){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM useraccount WHERE id = ${id}`)
                .then(res => resolve(res.rows[0]))
                .catch(e => reject(e)))
    };
};