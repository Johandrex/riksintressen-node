/* en databas pool är en metod som håller databaskopplingen öpen så att den kan återanvändas flera gånger */
/* postgres credentials */
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "root",
    password: "QG3QhfJtwdjMBb3NoKnq6BsgN8g2wOM0NaEe6S3GO0D5Rl",
    host: "109.225.108.59",
    port: 5432,
    database: "database"
});

module.exports = pool;