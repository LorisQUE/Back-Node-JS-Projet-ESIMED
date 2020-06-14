const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const UserAccountService = require('./services/useraccount');
const ListService = require("./services/list");
const ItemService = require("./services/item");
const PartageService = require("./services/partage");

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // URLEncoded form data
app.use(bodyParser.json());// application/json
app.use(cors());
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://user1:default1@database-1.c4bqhyjezkf6.us-east-1.rds.amazonaws.com:5432/base1";
const db = new pg.Pool({ connectionString: connectionString });
const userAccountService = new UserAccountService(db);
const partageService = new PartageService(db);
const listService = new ListService(db);
const itemService = new ItemService(db);
const jwt = require('./jwt')(userAccountService);
require('./api/useraccount')(app, userAccountService, jwt);
require('./api/list')(app, listService, jwt);
require('./api/item')(app, itemService, listService, jwt);
require('./api/partage')(app, partageService, listService, userAccountService, jwt);
const seeder = require('./datamodel/seeder');
seeder.listSeeder(listService, userAccountService, partageService)
.then(_ => seeder.itemSeeder(itemService)
.then(app.listen(3333)));