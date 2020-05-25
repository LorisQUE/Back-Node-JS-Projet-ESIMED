module.exports = class UserAccount {
    constructor(displayName, login, challenge) {
        this.displayName = displayName;
        this.login = login;
        this.challenge = challenge;
    }
}