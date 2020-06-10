const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')

module.exports = class UserAccountService {
    constructor(db) {
        this.dao = new UserAccountDAO(db)
    }
    insert(displayname, login, password, isConfirmed) {
        return this.dao.insert(new UserAccount(null, displayname, login, this.hashPassword(password), isConfirmed));
    }
    updatePassword(id, challenge){
        return this.dao.updatePassword({id: id,challenge: this.hashPassword(challenge)})
    }
    async validatePassword(login, password) {
        const user = await this.dao.getByLogin(login.trim());
        return this.comparePassword(password, user.challenge)
    }
    comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
}