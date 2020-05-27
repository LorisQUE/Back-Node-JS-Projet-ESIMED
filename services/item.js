const ItemDAO = require("../datamodel/itemdao");

module.exports = class ItemService {
    constructor(db) {
        this.dao = new ItemDAO(db);
    }

    isValid(item) {
        item.label = item.label.trim();
        if (item.label === "") return false;
        if (item.quantite < 1 || item.quantite == null) return false;
        if (item.ischecked == undefined || item.ischecked == null) return false;
        return true
    }
}