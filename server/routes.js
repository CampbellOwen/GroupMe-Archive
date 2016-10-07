module.exports = function(express, db) {

   var router = express.Router();

   router.get('/groups', function (req, res) {
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

   router.get('/messages', function (req, res) {
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

   return router;

}
