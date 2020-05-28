module.exports = class Partage {
    constructor(id_user, id_list, droit) {
        this.user_id = id_user;
        this.list_id = id_list;
        this.droit = !!droit;
    }
};