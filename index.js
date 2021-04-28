/* importera databas filer */
const database = require("./database");
const api = require("./api");

/** STARTA SERVERN **/
database.connect(); // databasen, uppkoppling
api.start(); // starta api:n