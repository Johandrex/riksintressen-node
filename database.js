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
            " WHERE cederat = false OR cederat IS null " +
            " GROUP  BY ri.id, ri.namn " +
            " ORDER BY ri.namn");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute getRiksintressen, exception: " + e);
        return [];
    }
}

/* hämta alla raderade riksintressen */
async function getRiksintressenListDeleted() {
    try {
        const results = await pool.query("SELECT ri.namn, ri.id, array_agg(DISTINCT kulturmiljotyp.namn) kategorier, array_agg(DISTINCT kommun.namn) kommuner, array_agg(DISTINCT lan.namn) lan" +
            " FROM riksintresse AS ri " +
            " LEFT JOIN riksintresse_har_kulturmiljotyp AS r_h_k ON r_h_k.riksintresse_id = ri.id " +
            " LEFT JOIN kulturmiljotyp ON r_h_k.kulturmiljotyp_id = kulturmiljotyp.id " +
            " LEFT JOIN riksintresse_i_kommun ON riksintresse_i_kommun.riksintresse_id = ri.id " +
            " LEFT JOIN kommun ON riksintresse_i_kommun.kommun_kod = kommun.kod " +
            " LEFT JOIN lan ON kommun.lan_kod = lan.kod " +
            " WHERE cederat = true " +
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
async function getLan() {
    try {
        const results = await pool.query("SELECT * FROM lan");
        return results.rows;
    } catch (e) {
        console.log("couldn't execute GetLan(), exception: " + e);
        return [];
    }
}

/* hämta de kommuner ett riksintresse ligger i */
async function getKulturmiljotyp() {
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
        const results = await pool.query("SELECT ri.id, ri.namn as namn, ri.beskrivning, ri.motivering, ri.cederat, ri.version, ri.geometri_id, array_agg(DISTINCT kulturmiljotyp.namn) kategorier, array_agg(DISTINCT kommun.namn) kommuner, array_agg(DISTINCT lan.namn) lan" +
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

/* uppdatera ett riksintresse med json data */
async function updateRiksintresse(json) {
    try {
        console.log("updateRiksintresse() received object: ");
        console.log(json);

        if (json.id != null) { // gå igenom varje json variabel som inte är null, och uppdatera de
            if (json.namn != null) await pool.query(`UPDATE riksintresse SET namn = '${json.namn}' WHERE id = ${json.id}`);
            if (json.beskrivning != null) await pool.query(`UPDATE riksintresse SET beskrivning = '${json.beskrivning}' WHERE id = ${json.id}`);
            if (json.motivering != null) await pool.query(`UPDATE riksintresse SET motivering = '${json.motivering}' WHERE id = ${json.id}`);
            if (json.cederat != null) await pool.query(`UPDATE riksintresse SET cederat = '${json.cederat}' WHERE id = ${json.id}`);

            if (json.kategorier[0] != null) {
                await pool.query(`DELETE FROM riksintresse_har_kulturmiljotyp WHERE riksintresse_id = ${json.id}`); // radera existerande kulturmiljötyper

                json.kategorier.forEach(async k => { // gå igenom alla kategorier i objektet
                    let kulturmiljotypId = await pool.query(`SELECT id FROM kulturmiljotyp WHERE namn = '${k}'`); // hämta ett id från varje kulturmiljötyp
                    await pool.query(`INSERT INTO riksintresse_har_kulturmiljotyp(riksintresse_id, kulturmiljotyp_id) VALUES(${json.id}, ${kulturmiljotypId.rows[0].id})`) // sätt in kulturmiljötyp
                });
            }
        }

        return "Successfully updated riksintresse " + json.id;
    } catch (e) {
        return "updateRiksintresse(), exception: " + e;
    }
}

/* skapa ett nytt riksintresse med json data */
async function createRiksintresse(json) {
    try {
        console.log("createRiksintresse() received object: ");
        console.log(json);

        if (json.namn != null && json.beskrivning != null && json.motivering != null) { // varje nytt objekt kräver ett namn
            await pool.query(`INSERT INTO geometri DEFAULT VALUES`); // skapa geometri som kopplas till databasen
            let geometriId = (await pool.query(`SELECT MAX(ID) FROM geometri`)).rows[0].max; // geometrin som nyss skapades

            await pool.query(`INSERT INTO riksintresse (namn, beskrivning, motivering, geometri_id) VALUES ('${json.namn}', '${json.beskrivning}', '${json.motivering}', '${geometriId}')`);

            if (json.kategorier != null) {
                json.kategorier.forEach(async k => { // gå igenom alla kategorier i objektet
                    let kulturmiljotypId = await pool.query(`SELECT id FROM kulturmiljotyp WHERE namn = '${k}'`); // hämta ett id från varje kulturmiljötyp
                    await pool.query(`INSERT INTO riksintresse_har_kulturmiljotyp(riksintresse_id, kulturmiljotyp_id) VALUES(${json.id}, ${kulturmiljotypId.rows[0].id})`) // sätt in kulturmiljötyp
                });
            }
        }

        let id = (await pool.query(`SELECT MAX(ID) FROM riksintresse`)).rows[0].max; // hämta det senaste riksintresset som skapades

        return {
            "id": id,
            "message": "Successfully created riksintresse"
        }
    } catch (e) {
        return {
            "message": "createRiksintresse(), exception: " + e
        };
    }
}

module.exports = {
    connect: connect,
    getRiksintressenList: getRiksintressenList,
    getRiksintressenListDeleted: getRiksintressenListDeleted,
    getRiksintresse: getRiksintresse,

    getKommuner: getKommuner,
    getLan: getLan,
    getKulturmiljotyp: getKulturmiljotyp,

    updateRiksintresse: updateRiksintresse,
    createRiksintresse: createRiksintresse,
}