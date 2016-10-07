// all these required modules are declared under one var - much tidier
var express = require('express'),
   bodyParser = require('body-parser'),
   request = require('request'),
   db = require('./db'),
   port = process.env.PORT || 8080; // this sets express to take the environments port rather than hardcoding one - makes things like heroku deployment easier

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
        res.sendFile('html/login.html', {root: './public'});
    }
    else {
        res.render('index', {token: req.query.access_token});
    }
});

// simple app.listen - if your app is particularly complex you can keep your db and port config stuff in a config.js file and set it by environments
app.listen(port, function() {
   console.log('GroupMe Archive - listening on port ' + port);
})
