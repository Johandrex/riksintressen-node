/* VARNING: sql-frågorna är inte SQL-injection skyddade!!! */
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
        const results = await pool.query("SELECT * FROM riksintresse ORDER BY id");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintressen, exception: " + e);
        return [];
    }
}


/*
SELECT r.id, r.namn, r.beskrivning, r.motivering, r.version, r.geometri_id,
	   kommun.namn as kommun, lan.namn as lan, kulturmiljotyp.namn as kulturmiljotyp, tidigare_version.id as tidigare_version_id FROM riksintresse as r
INNER JOIN riksintresse_i_kommun AS rik ON rik.riksintresse_id = r.id
INNER JOIN kommun ON rik.kommun_kod = kommun.kod
INNER JOIN lan ON kommun.lan_kod = lan.kod

/* left join, då läggs riksintressen till trots att de inte har en kulturmiljötyp/tidigare version 
LEFT JOIN riksintresse_har_kulturmiljotyp AS rhk ON rhk.riksintresse_id = r.id
LEFT JOIN kulturmiljotyp ON rhk.kulturmiljotyp_id = kulturmiljotyp.id

LEFT JOIN riksintresse_har_version AS rhv ON rhv.riksintresse_id = r.id
LEFT JOIN tidigare_version ON rhv.tidigare_version_id = tidigare_version.id
ORDER BY r.id;
*/

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

/* hämta ett riksintresses tidigare versioner */
async function getHistorik(id) {
    try {
        const results = await pool.query("SELECT * FROM riksintresse_har_version WHERE riksintresse_id = " + id);
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getHistorik(id), exception: " + e);
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
    getHistorik: getHistorik,
    getGeometrier: getGeometrier,
    getGeometri: getGeometri
}