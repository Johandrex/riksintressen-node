/* postgres */
const { Client } = require('pg');
const client = new Client({
    user: "root",
    password: "QG3QhfJtwdjMBb3NoKnq6BsgN8g2wOM0NaEe6S3GO0D5Rl",
    host: "109.225.108.59",
    port: 5432,
    database: "database"
})

/* försök connecta till databasen */
client.connect()
.then(() => console.log("Connected to database"))
.then(() => client.query("SELECT * FROM riksintresse"))
.then(results => console.table(results.rows))

.then(() => client.query("SELECT * FROM geometri"))
.then(results => console.table(results.rows))

.catch(e => console.log("Couldn't connect to database"))

.finally(() => client.end())

/* express */
const express = require('express');
const app = express(); /* funktioner: app.get(), app.post(), app.put(), app.delete() */



app.get('/', (req, res) => { /* kommer åt webbsidan */
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send([1, 2, 3]);
});

app.get('/api/courses/:id', (req, res) => {
    req.send(req.params.id);
});

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port :' + port));