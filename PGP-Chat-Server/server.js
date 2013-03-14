var https = require("https");
var url = require("url");
var fs = require('fs');
var express = require('express');
var app = express(); //the Express instance


var now = require('./nowchat.js');

const crypto = require('crypto');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";
var privateKey = fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem').toString();
var certificate = fs.readFileSync(runningDirectory+'sslKeys/certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});



var INDEX_FILE = "";

function start(route, handle){

	var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";

	var options = {
	  key: fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem'),
	  cert: fs.readFileSync(runningDirectory+'sslKeys/certificate.pem')
	};
	
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
    		console.log("Request for " + pathname + " received.");

    		route(handle, request, response);
	}

	

	/*
	POST-Handling für Registrierungsformular.
	Siehe: http://stackoverflow.com/questions/5710358/how-to-get-post-query-in-express-node-js
	*/
	app.use(express.bodyParser());//Nötig ab Express 3.0

	app.post('/register/neu.php', function(req, res) {
	    onRequest(req,res);
	});


	//Alle Files im Ordner chat veröffentlichen:
	app.use(express.static(__dirname + '/chat'));

	var server = https.createServer(options, app).listen(8080);
	//var server = https.createServer(onRequest).listen(8080); //without ssl for debug

	now.start(server);
	console.log("Server started\n");
}


exports.start = start;

