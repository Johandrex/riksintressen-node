# riksintressen-node

Applikationsprogrammeringsgränssnittet fungerar som en länk mellan databasen och webbsidan, syftet är att webbsidan ska kunna lagra och hämta data från/till databasen. Den är byggd i node.js med ramverket Node Express. Applikationen är uppbyggd av filerna i api.js, database-pool.js, databas.js och index.js. 

* index.js - startar databasen och API via database.js och api.js. 
* database-pool.js - skapar en aktiv koppling till databasen, filen innehåller inloggningsuppgifter till databasen som ingen utomstående har åtkomst till. 
* database.js - består av funktioner som utför SQL-queries mot databasen. 
* api.js - öppnar upp portar som externa applikationer kommer åt. 

För att illustrera hur applikationsprogrammeringsgränssnittets design och flöde fungerar kan vi använda ett exempel. Ifall en klient går in på webbsidan och öppnar upp listan med riksintressena skickas en API request från webbsidan till denna API. Då åkallas app.get(“/api/riksintressen/list”) i vår api.js. Funktionen utför await database.getRiksintressenList() som i database.js utför en SQL-query med kommandot pool.query("SELECT * FROM riksintresse ORDER BY id"). När queryn har utförts tar API:n emot resultatet och skickar vidare den till webbsidan. 

## information

riksintressen-node är uppbyggt i node.js och programmeringsspråket JavaScript. Projektet kräver ett flertal plugins som node express, pg, cors och express-fileupload för att fungera som avsett.

Skapare: Johannes Seldevall, Sebastian Sjöberg och Wibke Du Rietz.

## installation

1. installera npm från sajten "https://www.npmjs.com/get-npm"
2. klona repository med kommandot "git clone https://Johandrex@bitbucket.org/Johandrex/riksintressen-node.git"
3. gå in i repository mappen "cd riksintressen-node"
4. installera nödvändiga plugins via npm "npm install express pg cors express-fileupload"
5. installera nodemon globalt ifall node applikationen ska köras konstant och uppdateras vid förändringar "sudo npm i -g nodemon"
6. starta applikationen med "node index.js" eller "nodemon index.js"
