var fs = require("./fileSystem.js");
var url = require("url");

var fis = require("fs");

function start(request, response) {
	console.log("Request handler 'start' was called.");
	fis.readFile('./chat/index.html', function(err, data){	 	
	response.writeHead(200, {'Content-Type':'text/html'}); 
	response.write(data);  
	response.end();
 });
}

function javascriptFile(request, response){
fs.getJavascriptFile(fs.getFilenameFrom(url.parse(request.url).pathname),function(data){
		if(data!=0){    
			response.writeHead(200, {'Content-Type':'text/javascript'}); 
		    response.write(data);  
		    response.end();}else{
			response.write("not found");
response.end();		
	}
		  });
}

exports.start = start;
exports.javascriptFile=javascriptFile;
		    
