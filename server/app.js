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

// require in the routes
var apiRouter = require('./routes')(express, db);

// sets all routes in the apiRoute to be prefixed by /api, that way you don't have to type /api in front of everything
app.use('/api', apiRouter);

// leave this last, after all other routes - makes sure hitting '/' will always work and not get hijacked by the apiRouter
// if the front end framework has a router it might be worth hitting '*' and routing at the front end
app.get('/', function (req, res) {
    if (req.query.access_token == undefined) {
        res.sendFile('public/html/login.html', {root: __dirname});
    }
    else {
        res.render('index', {token: req.query.access_token});
    }
});
app.listen(port, function() {
   console.log('GroupMe Archive - listening on port ' + port);
})
