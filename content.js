/* express, REST API */
const express = require('express');
const app = express(); /* funktioner: app.get(), app.post(), app.put(), app.delete() */

/* tillåter Cross-Origin Resource Sharing, alltså att andra webbsidor kommer åt API:n */
const cors = require('cors');
app.use(cors());

// enable files upload
const fileUpload = require('express-fileupload');
const fs = require("fs");
app.use(fileUpload({
    createParentPath: true
}));
app.use(express.static("./uploads")); // Gör uploads offentligt för åtkomst, utanför express

// middleware, for app.get()
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

/* importera databas funktioner som används av api:n */
const database = require("./database");
const {
    response,
    static
} = require('express');

/* starta api */
function start() {

    /*********** GET ***********/

    /* startsidan för API */
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


    /* hämta ett riksintresses bilder/dokument */
    app.get('/api/files/:id', async (req, res) => {
        try {
            const directoryPath = "uploads/" + req.params.id;

            fs.readdir(directoryPath, function (err, files) {
                let fileInfos = [];

                if (files != undefined) { // kontrollera att filer finns, loopa då igenom de
                    files.forEach((file) => {
                        fileInfos.push({
                            name: file,
                            url: req.params.id + "/" + file,
                        });
                    });

                    res.send(JSON.stringify(fileInfos));
                } else if (err) { // ifall ett riksintresse inte har filer, informera om det.
                    res.send({
                        message: "There's no files associated with this riksintresse!",
                    });
                }
            });
        } catch (err) {
            res.send(err);
        }
    });

    /*********** POST ***********/

    /* ladda upp dokument/bilder */
    app.post('/api/upload', async (req, res) => {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                let file = req.files.file;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                console.log("File: " + file.name + " uploaded for id " + req.body.id);
                file.mv('uploads/' + req.body.id + '/' + file.name);

                //send response
                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    }
                });
            }
        } catch (err) {
            res.status(500).send(err);
        }
    });

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
console.log("lpphg")
