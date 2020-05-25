module.exports = class BaseDAO {
    constructor(db, table) {
        this.db = db;
        this.table = table;
    }


    delete(id){
        return new Promise((resolve, reject) =>
            this.db.query(`DELETE FROM ${this.table} WHERE id = ${id}`)
                .catch(e => reject(e)))
    }
}