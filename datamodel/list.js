module.exports = class List {
    constructor(lbl, date, useraccounrdid) {
        this.label = lbl;
        this.date = date.toLocaleDateString();
        this.isarchived = false;
        this.items = [];
        this.useraccountid = useraccounrdid;
    }

    addItem(item){
        this.items.push(item);
    }
}