const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const UserAccountService = require('./services/useraccount');
const ListService = require("./services/list");
const ItemService = require("./services/item");

const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // URLEncoded form data
app.use(bodyParser.json());// application/json
app.use(cors());
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

//const connectionString = "postgres://user:password@192.168.56.101/instance"
const connectionString = "postgres://postgres:admin@localhost:5432/listeCourses";
const db = new pg.Pool({ connectionString: connectionString });
const userAccountService = new UserAccountService(db);
const listService = new ListService(db);
const itemService = new ItemService(db);
const jwt = require('./jwt')(userAccountService);
require('./api/useraccount')(app, userAccountService, jwt);
require('./api/list')(app, listService, jwt);
require('./api/item')(app, itemService, listService, jwt);
const seeder = require('./datamodel/seeder');
seeder.listSeeder(listService, userAccountService)
.then( () => seeder.itemSeeder(itemService)
.then(app.listen(3333)));
