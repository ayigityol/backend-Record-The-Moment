var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var app = express();
//REQs

var URI = require('./URI.js')(); // CONNECTION STRING TO MONGODB
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
	
});
//POSTs END


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//APP END

