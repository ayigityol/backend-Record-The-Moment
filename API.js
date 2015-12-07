var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var app = express();
var assert = require("assert");
var bodyParser = require("body-parser");
var ObjectId = require("mongodb").ObjectId;
//REQs

var URI = require('./URI.js')(); // CONNECTION STRING TO MONGODB
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
        response.status(400);
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
                   "PASSWORD" : password,
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
//POSTs END


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
  console.log(URI);
});
//APP END

