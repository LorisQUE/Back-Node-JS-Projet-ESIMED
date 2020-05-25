const List = require('./list');
const Item = require('./item');
const UserAccount = require('./useraccount');
module.exports ={
    listSeeder: async (listService, userAccountService) => {
        return new Promise(async (resolve, reject) => {
            try {
                await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)");
                await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, label TEXT NOT NULL, date DATE, isArchived BOOLEAN, useraccountid INTEGER REFERENCES useraccount(id))");
            } catch (e) {
                if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                    resolve()
                } else {
                    reject(e)
                }
                return
            }

            for (let i = 1; i <= 2; i++) {
                userAccountService.insert("User" + i, "user"+i+"@random.com","admin")
                    .then(async _ => {
                        for (let j = 0; j < 5; j++) {
                            await listService.dao.insert(new List("Label " + j, new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), i))
                        }});
            }
            resolve();
        })
    },
    itemSeeder: async (itemService) => {
        return new Promise(async (resolve, reject) => {
            try {
                await itemService.dao.db.query("CREATE TABLE item(id SERIAL PRIMARY KEY, quantite NUMERIC NOT NULL, label TEXT NOT NULL, isChecked BOOLEAN, listId INTEGER, FOREIGN KEY (listId) REFERENCES list(id) ON DELETE CASCADE)")
            } catch (e) {
                if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                    resolve()
                } else {
                    reject(e)
                }
                return
            }
            for (let i = 1; i < 6; i++) {
                await itemService.dao.insert(new Item("Label" + i, 2*i, 1))
            }
            resolve()
        })
    }
};