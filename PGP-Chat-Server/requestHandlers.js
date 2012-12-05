var fs = require("./fileSystem.js");
var url = require("url");
var querystring = require("querystring");

var fis = require("fs");
var chat = require("./chat.js");
var constants = require("./constants.js");

function start(request, response) {
fs.getHTMLFile(url.parse(request.url).pathname,function(data){
		if(data!=""){    
			response.writeHead(200, {'Content-Type':'text/html'}); 
		    response.write(data);  
		    response.end();}else{
			fs.getHTMLFile("index.html",function(data){
			response.write(data);
			response.end();		
		});
	}
		  });
}

function javascriptFile(request, response){
fs.getJavascriptFile(url.parse(request.url).pathname,function(data){
		if(data!=""){    
			response.writeHead(200, {'Content-Type':'text/javascript'}); 
		    response.write(data);  
		    response.end();}else{
			response.write("not found");
response.end();		
	}
		  });
}

function registerUser(request, response){
	//hier den Request weiterleiten auf: chat.js registerUser(author, receiver, message); (am besten mit callback funktion!)
	var postData = "";

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });

    request.addListener("end", function() {
    	var postString = querystring.parse(postData);
    	var username = postString[constants.REGISTER_USER_FIELDNAME_USERNAME];
    	var privKey = postString[constants.REGISTER_USER_FIELDNAME_PRIVATE_KEY];
    	var pubKey = postString[constants.REGISTER_USER_FIELDNAME_PUBLIC_KEY];
    	var password = postString[constants.REGISTER_USER_FIELDNAME_PASSWORD];
        chat.registerUser(username, pubKey, privKey, password, function(res){
            if(res){
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write("<html><body>Erfolg! -> <a href='/'>hier gehts weiter!</a></body></html>");
                response.end();
            }else{
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write("<html><body>Fehler</body></html>");
                response.end();
            }
        });
    });

}

exports.start = start;
exports.javascriptFile=javascriptFile;
exports.registerUser = registerUser;    
