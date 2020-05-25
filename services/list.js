const ListDAO = require("../datamodel/listdao")

module.exports = class ListService {
    constructor(db) {
        this.dao = new ListDAO(db);
    }

    isValid(list) {
        list.label = list.label.trim();
        console.log(list.label)
        if (list.label === "") return false;
        console.log(list.label)
        if (list.date == undefined || list.date == null) return false;
        console.log(list.date)
        if (list.isarchived == undefined || list.isarchived == null) return false;
        console.log(list.isarchived)
        return true
    }
}