const bcrypt = require('bcrypt')
const UserAccountDAO = require('../datamodel/useraccountdao')
const UserAccount = require('../datamodel/useraccount')

module.exports = class UserAccountService {
    constructor(db) {
        this.dao = new UserAccountDAO(db)
    }
    insert(displayname, login, password) {
        return this.dao.insert(new UserAccount(displayname, login, this.hashPassword(password)))
    }
    async validatePassword(login, password) {
        console.log('login',login,'password',password)
        const user = await this.dao.getByLogin(login.trim());
        console.log('USER', user)
        console.log(user.challenge, password)
        return this.comparePassword(password, user.challenge)
    }
    comparePassword(password, hash) {
        console.log(password, 'aaaaa', hash)
        return bcrypt.compareSync(password, hash)
    }
    hashPassword(password) {
        return bcrypt.hashSync(password, 10)  // 10 : cost factor -> + élevé = hash + sûr
    }
}