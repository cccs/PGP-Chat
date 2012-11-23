var fs=require('fs');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";
var javascriptDirectory = runningDirectory+"chat/js/";
var htmlDirectory = runningDirectory+"chat/html/";


function getHTMLFile(name, callback){
var fileName=htmlDirectory+name;
callback(getFileContent(fileName));
}

function getJavascriptFile(name, callback){
var fileName=javascriptDirectory+name;
callback(getFileContent(fileName));
}

function getFilenameFrom(path){
var Ausdruck = /([^\/]*)$/;
Ausdruck.exec(path);
return RegExp.$1;
}

function getPathFrom(path){
var Ausdruck = /(.*\/)([^\/]*)$/;
Ausdruck.exec(path);
return RegExp.$1;
}

exports.getJavascriptFile = getJavascriptFile;
exports.getHTMLFile = getHTMLFile;
exports.getFilenameFrom=getFilenameFrom;
exports.getPathFrom=getPathFrom;

//Hilfsfunktionen:

function getFileContent(fileName){
console.log("Getting file:"+fileName+"\n");
//fs.existsSync(fileName , function (exist) { //hier gibts nen Fehler "Type Error"
  	if(fs.existsSync(fileName) && fs.lstatSync(fileName).isFile()){
		return fs.readFileSync(fileName, 'utf8');
	}else{
		return "";	
	}
//});
}
