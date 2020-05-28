const BaseDAO = require('./basedao');

module.exports = class PartageDAO extends BaseDAO {
    constructor(db) {
        super(db, 'partage');
    };

    insert(partage) {
        return this.db.query("INSERT INTO partage(user_id, list_id, droit) VALUES ($1,$2,$3)",
            [partage.user_id, partage.list_id, partage.droit]);
    };

    //Get toutes les listes partagées avec un user --> 'Les listes qu'on a partagées avec moi'
    getAllByUserId(id) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM partage INNER JOIN list ON list.id = list_id WHERE user_id = $1 ORDER BY list_id", [id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)));
    };

    //Get tout les partages avec une liste --> 'Voir à qui a été partagée cette liste'
    getAllByListId(id) {
        console.log('id :', id)
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM partage INNER JOIN useraccount ON useraccount.id = user_id WHERE list_id = $1 ORDER BY user_id", [id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)));
    };

    //Get tout les partages de mes listes
    getAll(user) {
        return new Promise((resolve, reject) =>
            this.db.query("SELECT * FROM partage INNER JOIN list ON list.id = list_id WHERE useraccountid = $1 ORDER BY list_id", [user.id])
                .then(res => resolve(res.rows))
                .catch(e => reject(e)));
    };

    //Get un partage précis
    getById(id){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM partage WHERE id = ${id}`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)));
    };

    update(partage) {
        return this.db.query("UPDATE partage SET user_id=$2, list_id=$3, droit=$4 WHERE id=$1",
            [partage.id, partage.user_id, partage.list_id, partage.droit]);
    };

    checkExisting(userId, listId){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM partage WHERE user_id = ${userId} AND list_id = ${listId}`)
                .then(res => resolve(res.rows))
                .catch(e => reject(e)));
    }
};