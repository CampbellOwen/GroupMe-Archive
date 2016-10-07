var express = require('express'),
   bodyParser = require('body-parser'),
   request = require('request'),
   db = require('./db'),
   port = process.env.PORT || 8080;

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

require('./routes')(app, db);

app.listen(port, function() {
   console.log('GroupMe Archive - listening on port ' + port);
})
