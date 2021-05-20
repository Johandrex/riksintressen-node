# README #

### Installation ###
# git clone
1. git clone https://Johandrex@bitbucket.org/Johandrex/node-express.git

# gå in i klonen
2. cd node-express

# installera node moduler i projektet
3. npm install express pg cors express-fileupload
sudo npm i -g nodemon

# starta applikationen
4. nodemon index.js

### Beskrivning ###

Applikationsprogrammeringsgränssnittet fungerar som en länk mellan databasen och webbsidan, syftet är att webbsidan ska kunna lagra och hämta data från/till databasen. Den är byggd i node.js med ramverket Node Express. Applikationen är uppbyggd av filerna i api.js, database-pool.js, databas.js och index.js. 

* index.js - startar databasen och API via database.js och api.js. 
* database-pool.js - skapar en aktiv koppling till databasen, filen innehåller inloggningsuppgifter till databasen som ingen utomstående har åtkomst till. 
* database.js - består av funktioner som utför SQL-queries mot databasen. 
* api.js - öppnar upp portar som externa applikationer kommer åt. 

För att illustrera hur applikationsprogrammeringsgränssnittets design och flöde fungerar kan vi använda ett exempel. Ifall en klient går in på webbsidan och öppnar upp listan med riksintressena skickas en API request från webbsidan till denna API. Då åkallas app.get(“/api/riksintressen/list”) i vår api.js. Funktionen utför await database.getRiksintressenList() som i database.js utför en SQL-query med kommandot pool.query("SELECT * FROM riksintresse ORDER BY id"). När queryn har utförts tar API:n emot resultatet och skickar vidare den till webbsidan. 