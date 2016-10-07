var express = require('express'),
   bodyParser = require('body-parser'),
   pgp = require("pg-promise")(),
   request = require('request');


var cn = {
    host:'localhost',
    port:'5432',
    database:'groupme'
};
var db = pgp(cn);

var app = express();

app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/', function (req, res) {
    if (req.query.access_token == undefined) {
        res.sendFile('public/html/login.html', {root: __dirname});
    }
    else {
        res.render('index', {token: req.query.access_token});
    }
});

app.get('/api/groups', function (req, res) {
    if (!req.query.token) {
        res.status(500);
        res.send({"Error": "Please provide an access token"});
    }
    request.get('http://api.groupme.com/v3/groups?token=' + req.query.token,
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        res.status(200);
                        res.send(body);
                    }
                    else {
                        console.log(response);
                        res.status(500);
                        res.send({"Error": "API call error"});
                    }
                });

});

app.get('/api/messages', function (req, res) {
    if(!req.query.group) {
        res.status(500);
        res.send({"Error": "Please provide a group id"});
    }

    db.any("SELECT * FROM messages WHERE group_id = $1 ORDER BY created_at ASC", [req.query.group])
        .then(function(data) {
            res.send(data);
        })
        .catch(function(data) {
            console.log(data);
        });
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("GroupMe Archive - listening at http://%s:%s", host, port);
});

