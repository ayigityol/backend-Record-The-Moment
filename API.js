var express = require('express');
//var db = require('./db.js');
var app = express();
//var connection = db();

app.set('port', (process.env.PORT || 1071)); // port configuration

app.get("/",function(request, response){
		response.send("Welcome");
	
});


app.post("/register",function(request, response){
	
	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


