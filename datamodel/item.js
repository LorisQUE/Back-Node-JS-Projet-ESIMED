module.exports = class Item {
    constructor(lbl, qte, listId) {
        this.label = lbl;
        this.quantite = qte;
        this.listid = listId;
        this.ischecked = false;
    }
}
