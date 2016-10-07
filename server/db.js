var pgp = require("pg-promise")();

var connection = {
   host: 'localhost',
   port: '5432',
   database: 'groupme'
}

var db = pgp(connection);

module.exports = db;
