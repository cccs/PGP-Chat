var https = require("https");
var url = require("url");
var fs = require('fs');
var nowjs = require("now");
const crypto = require('crypto');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";
var privateKey = fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem').toString();
var certificate = fs.readFileSync(runningDirectory+'sslKeys/certificate.pem').toString();

var credentials = crypto.createCredentials({key: privateKey, cert: certificate});



var INDEX_FILE = ""

function start(route){

	var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";

	var options = {
	  key: fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem'),
	  cert: fs.readFileSync(runningDirectory+'sslKeys/certificate.pem')
	};

	var server = https.createServer(options, function (req, response) {
		fs.readFile('./chat/index.html', function(err, data){
		    response.writeHead(200, {'Content-Type':'text/html'}); 
		    response.write(data);  
		    response.end();
		  });
	}).listen(8080);



var everyone = nowjs.initialize(server);


everyone.connected(function(){
	  console.log("Joined: " + this.now.name);
	});


	everyone.disconnected(function(){
	  console.log("Left: " + this.now.name);
	});

everyone.now.distributeMessage = function(message){
	everyone.now.receiveMessage(this.now.name, message);
};
}

/*
function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}
*/

exports.start = start;

