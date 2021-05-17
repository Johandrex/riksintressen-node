/* express, REST API */
const express = require('express');
const app = express(); /* funktioner: app.get(), app.post(), app.put(), app.delete() */

/* tillåter Cross-Origin Resource Sharing, alltså att andra webbsidor kommer åt API:n */
const cors = require('cors');
app.use(cors());

// middleware, for app.get()
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

/* importera databas funktioner som används av api:n */
const database = require("./database");
const {
    response
} = require('express');

/* starta api */
function start() {

    /*********** GET ***********/

    /* för att kolla så API:n fungerar */
    app.get('/', (req, res) => {
        /* kommer åt webbsidan */
        res.send('Welcome to our super API!');
    });

    /* hämtar listdata med alla riksintressen*/
    app.get('/api/riksintressen/list', async (req, res) => {
        const data = await database.getRiksintressenList();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar listdata med alla raderade riksintressen*/
    app.get('/api/riksintressen/list/deleted', async (req, res) => {
        const data = await database.getRiksintressenListDeleted();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämta specifikt riksintresse utifrån ID */
    app.get('/api/riksintressen/:id', async (req, res) => {
        const data = await database.getRiksintresse(req.params.id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla tidigare versioner av ett riksintressen */
    app.get('/api/riksintressen/historik/:id', async (req, res) => {
        const data = await database.getHistorik(req.params.id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla kommuner */
    app.get('/api/kommuner', async (req, res) => {
        const data = await database.getKommuner();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla lan */
    app.get('/api/lan', async (req, res) => {
        const data = await database.getLan();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla kommuner */
    app.get('/api/kulturmiljotyper', async (req, res) => {
        const data = await database.getKulturmiljotyp();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /*********** POST ***********/

    /* uppdatera ett existerande riksintresse */
    app.post('/api/update/riksintresse', async (req, res) => {
        let message;

        try {
            message = await database.updateRiksintresse(req.body); // uppdatera objekt
        } catch (exception) {
            message = "Could not update riksintresse, exception: " + exception;
        }

        console.log(message);
        res.send(JSON.stringify(message));
    });

    /* uppdatera ett existerande riksintresse */
    app.post('/api/create/riksintresse', async (req, res) => {
        let message;

        try {
            message = await database.createRiksintresse(req.body); // uppdatera objekt
        } catch (exception) {
            message = "Could not create riksintresse, exception: " + exception;
        }

        console.log(message.message + " " + message.id);
        res.send(message);
    });

    app.listen(3000, () => console.log('Server started on port 3000')); // starta servern
}

module.exports = {
    start: start
}