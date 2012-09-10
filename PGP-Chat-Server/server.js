var http = require("http");
var url = require("url");
﻿var fs = require('fs');
var nowjs = require("now");

var INDEX_FILE = ""

function start(route){
var server = http.createServer(function(req, response){
  fs.readFile('./chat/index.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'}); 
    response.write(data);  
    response.end();
  });
});
server.listen(8080);



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

