var express = require('express'); // express
var bodyParser = require("body-parser"); // for handling post requests

var mongoClient = require('mongodb').MongoClient; // mongoDB
var assert = require("assert");  // used at mongoDB
var URI = require('./URI.js')(); // CONNECTION STRING TO MONGODB

var bcrypt = require("bcrypt"); // for hashing password

var app = express();
var salt = bcrypt.genSaltSync(10); // for hashing password
//REQs

app.use(bodyParser.json()); // application/json REQUEST BODY PARSER
//CONFIGs


//APP START
app.set('port', (process.env.PORT || 1071)); // port configuration

//GETs START
app.get("/",function(request, response){
	console.log("reach to / -GET");
	response.send("Welcome");
	
});

//GETs END

//POSTs START
app.post("/register",function(request, response){
    console.log("reach to /register -POST");
    console.log("Params : " + JSON.stringify(request.body));
    if(!request.is("json")){
        response.status(400).send("Bad Request");
    }
    else{
        try{
            var username = request.body["USERNAME"];
            var mail = request.body["MAIL"];
            var password = request.body["PASSWORD"];
           
            var insertDocument = function(db, callback){
               db.collection("USER").insertOne({
                   "USERNAME" : username,
                   "MAIL" : mail,
                   "PASSWORD" : bcrypt.hashSync(password, salt),
                   "DATE" : new Date(),
                   "VALID" : false,
                   "LAST_ACCESS" : null
               }, function(err,result){
                   assert.equal(err,null);
                   console.log("User created. Detail : username " + 
                   username + " mail " + mail );
                   callback(result);
               });
            };
        }
        catch(e){
            console.log("Internal server error -> Expection details :" + JSON.stringify(e));
            response.status(500).send("Internal Server Error");
        }
        mongoClient.connect(URI,function(err,db){
            assert.equal(null, err);
            insertDocument(db, function(){
                response.send("Object created!");
                db.close();
            });
        });
    }
});

app.post("/login",function(request, response){
    console.log("reach to /login -POST");
    console.log("Params : " + JSON.stringify(request.body));
    if(!request.is("json")){
        response.status(400);
    }
    else{
        try {
            var username = request.body["USERNAME"];
            var password = request.body["PASSWORD"];
            var session = "Sample Session!" // TO DO session!
            
            var loginQuery = function(db, callback) {
                db.collection('USER').findOneAndUpdate({"USERNAME" : username}, 
                { $currentDate: { LAST_ACCESS: true } }, {},
                function(err, document) {
                    if(document.value){
                        if(bcrypt.compareSync(password, document.value.PASSWORD)){
                            console.log("Username :" + username + " Password : " + password + " is authorized! (" + request.ip + " )");
                            response.send(session);
                        }
                        else{
                            console.log("Username :" + username + " is unauthorized! (" + request.ip + " )");
                            response.status(401).send("Unauthorized")
                        }
                        callback();
                    }
                    else{
                        console.log("Username :" + username + " Password : " + password + " is unauthorized! (" + request.ip + " )");
                        response.status(401).send("Unauthorized");
                    }
                });
            };
        } catch (e) {
            console.log("Internal server error -> Expection details :" + JSON.stringify(e));
            response.status(500).send("Internal Server Error");
        }
        mongoClient.connect(URI,function(err,db){
            assert.equal(null, err);
            loginQuery(db, function() {
                db.close();
            });
           });
    }
});


//POSTs END




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  console.log(URI);
});
//APP END

