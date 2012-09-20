var fs=require('fs');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";
var javascriptDirectory = runningDirectory+"chat/js/";

function getHTMLFile(name, callback){
}

function getJavascriptFile(name, callback){
var fileName=javascriptDirectory+name;
fs.exists(fileName, function (exists) { //hier gibts nen Fehler "Type Error"
  	if(exists){
		fs.readFile(fileName, function(err, data){
			callback(data);    
		  });
	}else{
		callback(0);	
	}
});
}

function getFilenameFrom(path){
var Ausdruck = /([^\/]*)$/;
Ausdruck.exec(path);
return RegExp.$1;
}

function getPathFrom(path){
var Ausdruck = /(.*)\/([^\/]*)$/;
Ausdruck.exec(path);
return RegExp.$1;
}

exports.getJavascriptFile = getJavascriptFile;
exports.getHTMLFile = getHTMLFile;
exports.getFilenameFrom=getFilenameFrom;
exports.getPathFrom=getPathFrom;
