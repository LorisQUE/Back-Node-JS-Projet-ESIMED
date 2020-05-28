const PartageDAO = require("../datamodel/partagedao");

module.exports = class PartageService {
    constructor(db) {
        this.dao = new PartageDAO(db);
    }

    isValid(partage) {
        if (!(!!partage.user_id) || !(!!partage.list_id)) return false;
        if (partage.droit == undefined || partage.droit == null) return false;
        return true
    }
}