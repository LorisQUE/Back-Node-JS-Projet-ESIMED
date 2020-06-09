module.exports = class UserAccount {
    constructor(id, displayname, login, challenge, isConfirmed) {
        this.id = id;
        this.displayname = displayname;
        this.login = login;
        this.challenge = challenge;
        this.isConfirmed = !!isConfirmed;
    }
};