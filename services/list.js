const ListDAO = require("../datamodel/listdao")

module.exports = class ListService {
    constructor(db) {
        this.dao = new ListDAO(db);
    }

    isValid(list) {
        console.log(list)
        list.label = list.label.trim();
        console.log('zone1')
        if (list.label === "") return false;
        console.log('zone2')
        if (list.date == undefined || list.date == null) return false;
        console.log('zone3')
        if (list.isarchived == undefined || list.isarchived == null) return false;
        console.log('zone4')
        return true
    }
}