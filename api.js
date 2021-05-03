/* express, REST API */
const express = require('express');
const app = express(); /* funktioner: app.get(), app.post(), app.put(), app.delete() */

/* tillåter Cross-Origin Resource Sharing, alltså att andra webbsidor kommer åt API:n */
const cors = require('cors');
app.use(cors());

/* importera databas funktioner som används av api:n */
const database = require("./database");

/* starta api */
function start() {
    /* för att kolla så API:n fungerar */
    app.get('/', (req, res) => { /* kommer åt webbsidan */
        res.send('Welcome to our super API!');
    });

    /* hämtar alla riksintressen */
    app.get('/api/riksintressen', async (req, res) => {
        const data = await database.getRiksintressen();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla tidigare versioner av ett riksintressen */
    app.get('/api/riksintressen/historik/:id', async (req, res) => {
        const data = await database.getHistorik(req.params.id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämta specifikt riksintresse utifrån ID */
    app.get('/api/riksintressen/:id', async (req, res) => {
        const data = await database.getRiksintresse(req.params.id);
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla geografisk data */
    app.get('/api/geometrier/:id', async (req, res) => {
        const data = await database.getGeometrier();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar specifikt geografisk data utifrån ID (alltså inte riksintressets ID, polygonens ID) */
    app.get('/api/geometrier', async (req, res) => {
        const data = await database.getGeometri(req.params.id);
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
        const data = await database.GetLan();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    /* hämtar alla kommuner */
    app.get('/api/kulturmiljotyper', async (req, res) => {
        const data = await database.GetKulturmiljotyp();
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(data));
    });

    app.listen(3000, () => console.log('Server started on port 3000')); // starta servern
}

module.exports = {
    start: start
}