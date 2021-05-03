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

/* hämta kulturmiljötyper kopplade till alla riksintressen */
async function getRiksintressenKulturmiljotyper() {
    try {
        const results = await pool.query("SELECT * FROM riksintresse ORDER BY id");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintressenKulturmiljotyp(), exception: " + e);
        return [];
    }
}

/* hämta kommuner kopplade till alla riksintressen */
async function getRiksintressenKommuner() {
    try {
        const results = await pool.query("SELECT kulturmiljotyp.id, kulturmiljotyp.namn from riksintresse_har_kulturmiljotyp" + 
        " INNER JOIN kulturmiljotyp ON riksintresse_har_kulturmiljotyp.kulturmiljotyp_id = kulturmiljotyp.id" + 
        " WHERE riksintresse_id = " + id + " ORDER BY riksintresse_id");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintressenKommuner(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function getKommuner() {
    try {
        const results = await pool.query("SELECT * FROM kommun;");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getKommuner(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function GetLan() {
    try {
        const results = await pool.query("SELECT * FROM lan");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute GetLan(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function GetKulturmiljotyp() {
    try {
        const results = await pool.query("SELECT * FROM kulturmiljotyp");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute GetKulturmiljotyp(id), exception: " + e);
        return [];
    }
}

/* hämta ett riksintresse */
async function getRiksintresse(id) {
    try {
        const results = await pool.query("SELECT * FROM riksintresse WHERE riksintresse_id = " + id);
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintresse(id), exception: " + e);
        return [];
    }
}

/* hämta ett riksintresses tidigare versioner */
async function getRiksintresseHistorik(id) {
    try {
        const results = await pool.query("SELECT * FROM riksintresse_har_version WHERE riksintresse_id = " + id);
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintresseHistorik(id), exception: " + e);
        return [];
    }
}

/* hämta ett riksintresses kulturmiljötyper */
async function getRiksintresseKulturmiljo(id) {
    try {
        const results = await pool.query("SELECT kulturmiljotyp.id, kulturmiljotyp.namn from riksintresse_har_kulturmiljotyp" + 
        " INNER JOIN kulturmiljotyp ON riksintresse_har_kulturmiljotyp.kulturmiljotyp_id = kulturmiljotyp.id" + 
        " WHERE riksintresse_id = " + id + " ORDER BY riksintresse_id");
        return results.rows;
    } catch(e) {
        console.log("couldn't execute getRiksintresseKulturmiljö(id), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function getRiksintresseKommuner(id) {
    try {
        const results = await pool.query("SELECT kommun.namn as Kommun, lan.namn as Lan FROM riksintresse_i_kommun" +
            " INNER JOIN kommun ON kommun.kod = riksintresse_i_kommun.kommun_kod" +
            " INNER JOIN lan ON lan.kod = kommun.lan_kod" +
            " WHERE riksintresse_id = 1;");
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

    getKommuner: getKommuner,
    GetLan: GetLan,
    GetKulturmiljotyp: GetKulturmiljotyp,

    getRiksintresse: getRiksintresse,
    getGeometrier: getGeometrier,
    getGeometri: getGeometri
}