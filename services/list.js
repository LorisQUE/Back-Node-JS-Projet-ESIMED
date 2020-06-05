const ListDAO = require("../datamodel/listdao")

module.exports = class ListService {
    constructor(db) {
        this.dao = new ListDAO(db);
    }

    isValid(list) {
        list.label = list.label.trim();
        if (list.label === "") return false;
        if (list.date == undefined || list.date == null) return false;
        if (list.isarchived == undefined || list.isarchived == null) return false;
        return true
    }
}