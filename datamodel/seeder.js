const List = require('./list');
const Item = require('./item');
const UserAccount = require('./useraccount');
const Partage = require('./partage');
module.exports ={
    listSeeder: async (listService, userAccountService, partageService) => {
        return new Promise(async (resolve, reject) => {
            try {
                await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL, isConfirmed BOOLEAN NOT NULL)");
                await listService.dao.db.query("CREATE TABLE list(id SERIAL PRIMARY KEY, label TEXT NOT NULL, date DATE, isArchived BOOLEAN, useraccountid INTEGER REFERENCES useraccount(id))");
                await partageService.dao.db.query("CREATE TABLE partage(id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, list_id INTEGER NOT NULL, droit BOOLEAN, FOREIGN KEY (user_id) REFERENCES useraccount(id) ON DELETE CASCADE, FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE)")
            } catch (e) {
                if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                    resolve();
                } else {
                    console.log(e);
                    reject(e);
                }
                return;
            }
            let flagLoop = false;
            for (let i = 1; i <= 2; i++) {
                userAccountService.insert("User" + i, "user"+i+"@random.com","admin", true)
                    .then(async _ => {
                        for (let j = 0; j < 5; j++) {
                            await listService.dao.insert(new List("Label " + j, new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)), i));

                            //J'arrive pas de manière asynchrone à attendre la fin du for, pour ajouter mes partage dans la bdd
                            //Alors d'une manière un peu dégeu, j'ai un flag qui passe à true quand la dernière opération du for est fini
                            if(i === 2 && j === 4)flagLoop = true;
                            if(flagLoop){
                                await partageService.dao.insert(new Partage(1, 6, false));
                                await partageService.dao.insert(new Partage(1, 7, true));
                                await partageService.dao.insert(new Partage(2, 1, false));
                                await partageService.dao.insert(new Partage(2, 2, true));
                            }
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