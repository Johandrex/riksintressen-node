/* Koden och funktionerna är inte SQL-injection skyddade!!! */
/* importera databas poolen */
const pool = require("./database-pool");

/* försök connecta till databasen */
async function connect() {
    try {
        await pool.connect();
        console.log("Connected to database");
    } catch(e) {
        console.log("Couldn't connect to database, error: " + e);
    }
}

/* hämta alla existerande riksintressen */
async function getRiksintressen() {
    try {
        const results = await pool.query("SELECT * FROM riksintresse");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintressen, exception: " + e);
        return [];
    }
}

/* hämta ett riksintressen */
async function getRiksintresse(id) {
    try {
        const results = await pool.query("SELECT * FROM riksintresse WHERE id = " + id);
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintresse(id), exception: " + e);
        return [];
    }
}

/* hämta alla existerande geometrier */
async function getGeometrier() {
    try {
        const results = await pool.query("SELECT * FROM geometri");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getGeometrier, exception: " + e);
        return [];
    }
}

/* hämta en geometri */
async function getGeometri(id) {
    try {
        const results = await pool.query("SELECT * FROM geometri WHERE id = " + id);
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getGeometrie(id), exception: " + e);
        return [];
    }
}

module.exports = {
    connect: connect,
    getRiksintressen: getRiksintressen,
    getRiksintresse: getRiksintresse,
    getGeometrier: getGeometrier,
    getGeometri: getGeometrier
}