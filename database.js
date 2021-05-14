/* VARNING: sql-frågorna är inte SQL-injection skyddade!!! */
/* importera databas poolen */
const pool = require("./database-pool");

/* försök connecta till databasen */
async function connect() {
    try {
        await pool.connect();
        console.log("Connected to database");
    } catch (e) {
        console.log("Couldn't connect to database, error: " + e);
    }
}

/* hämta alla existerande riksintressen tillsammans med relevant data för listan */
async function getRiksintressenList() {
    try {
        const results = await pool.query("SELECT ri.namn, ri.id, array_agg(DISTINCT kulturmiljotyp.namn) kategorier, array_agg(DISTINCT kommun.namn) kommuner, array_agg(DISTINCT lan.namn) lan" +
            " FROM riksintresse AS ri " +
            " LEFT JOIN riksintresse_har_kulturmiljotyp AS r_h_k ON r_h_k.riksintresse_id = ri.id " +
            " LEFT JOIN kulturmiljotyp ON r_h_k.kulturmiljotyp_id = kulturmiljotyp.id " +
            " LEFT JOIN riksintresse_i_kommun ON riksintresse_i_kommun.riksintresse_id = ri.id " +
            " LEFT JOIN kommun ON riksintresse_i_kommun.kommun_kod = kommun.kod " +
            " LEFT JOIN lan ON kommun.lan_kod = lan.kod " +
            " GROUP  BY ri.id, ri.namn " +
            " ORDER BY ri.namn");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute getRiksintressen, exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function getKommuner() {
    try {
        const results = await pool.query("SELECT * FROM kommun;");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute getKommuner(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function GetLan() {
    try {
        const results = await pool.query("SELECT * FROM lan");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute GetLan(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function GetKulturmiljotyp() {
    try {
        const results = await pool.query("SELECT * FROM kulturmiljotyp ORDER BY namn");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute GetKulturmiljotyp(id), exception: " + e);
        return [];
    }
}

/* hämta ett riksintresse */
async function getRiksintresse(id) {
    try {
        const results = await pool.query("SELECT ri.id, ri.namn as namn, ri.beskrivning, ri.motivering, ri.version, ri.geometri_id, array_agg(DISTINCT kulturmiljotyp.namn) kategorier, array_agg(DISTINCT kommun.namn) kommuner, array_agg(DISTINCT lan.namn) lan" +
            " FROM riksintresse AS ri" +
            " LEFT JOIN riksintresse_har_kulturmiljotyp AS r_h_k ON r_h_k.riksintresse_id = ri.id" +
            " LEFT JOIN kulturmiljotyp ON r_h_k.kulturmiljotyp_id = kulturmiljotyp.id" +
            " LEFT JOIN riksintresse_i_kommun ON riksintresse_i_kommun.riksintresse_id = ri.id" +
            " LEFT JOIN kommun ON riksintresse_i_kommun.kommun_kod = kommun.kod" +
            " LEFT JOIN lan ON kommun.lan_kod = lan.kod" +

            " WHERE ri.id = " + id +
            " GROUP  BY ri.id, ri.namn, ri.beskrivning, ri.motivering, ri.geometri_id");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute getRiksintresse(id), exception: " + e);
        return [];
    }
}

/* hämta ett riksintresses tidigare versioner */
async function getRiksintresseHistorik(id) {
    try {
        const results = await pool.query("SELECT * FROM riksintresse_har_version WHERE riksintresse_id = " + id);
        return results.rows;
    } catch (e) {
        console.log("couldn't execute getRiksintresseHistorik(id), exception: " + e);
        return [];
    }
}

module.exports = {
    connect: connect,
    getRiksintressenList: getRiksintressenList,
    getRiksintresse: getRiksintresse,

    getKommuner: getKommuner,
    GetLan: GetLan,
    GetKulturmiljotyp: GetKulturmiljotyp,
}