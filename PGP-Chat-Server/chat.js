var database = require('./database.js');
var passwordHash = require('password-hash');

function sendMessage(author, authorSessionId, receiver, message, callback){
	if(callback == undefined) callback = function(ret){console.log("Return from sendMessage: "+ret)};
	database.getUsernameFromEnabledSession(authorSessionId, function(ret){
		if(ret != false){
			database.addMessage(author, receiver, message, callback);
		}else{
			callback(false);
		}
	});
}

function getMessages(forUser, callback){
	//hier gibt es noch viel zu tun... Auf der Clientseite sollten die Nachrichten nach dem Erfassungsdatum sotiert werden (Messages.Zeitpunkt in der Datenbank)
	database.getMessages(forUser, callback);
}

function registerUser(username, pubKey, privKey, password, callback){
	//hier muss mithile von database.js der User registriert werden. Davor eingegebene Werte prüfen!
	password = passwordHash.generate(password); // Passwort wird als Hash abgespeichert
	database.addUser(username, pubKey, privKey, password, callback);
}

/*
function getUserQuestion(username, callback){
	database.getUserQuestion(username,callback);
}
*/

function getUserPrivateKey(name, password, callback){
	verifyUserPW(name, password, function(ret){
		if(ret == true){
			database.getUserPrivateKey(name, callback);
		}else{
			return null;
		}
	});
}

/**
Interne/privat Funktion
Wird ein gültiger username und passwort übergeben wird callback mit true,
ansonsten mit false aufgerufen.
*/
function verifyUserPW(username, userpw, callback){
	database.getUserPW(username, function(ret){
		if(ret != null){
			callback(passwordHash.verify(userpw, ret));
		}else{
			callback(false);
		}
	});
}

function createUserSession(username, password, session){

}

/*
callback wird mit zwei String-Arrays aufgerufen, welche name und pubkey enthalten:
callback(names, pubkeys)
*/
function getUsers(callback){
	database.getAllUsers(callback);
}

//function getUserPublicKey(name, callback){
//	database.getUserPublicKey
//}

/*
Registriert eine sessionID auf einen Usernamen. Dadurch gilt ein Benutzer als eingelogt.
1, falls erfolg!
0, falls Fehler!
*/
function userLogin(username, sessionID, callback){
database.createSession(username, sessionID, callback);
}

function userLogout(username, sessionID){
	return false;
}

/*
checkUserLogin:
returns true, falls user momentan mit diese session eingelogt ist.
*/
function checkUserLogin(username, session, callback){
	getUserName(session, function(ret){
		if(ret = username){
			callback(true);
		}else{
			callback(false);
		}
	});
}

/*
Liefert den Usernamen, welcher der übergebenen Session/ClientId zugeordnet ist.
*/
function getUserName(session, callback){
	database.getUsernameFromEnabledSession(session, callback);
}

var onlineUser = new Object();

function setUserOnlineStatus(username, online){
	//Diese Funktion könnte auch mittels Datenbank umgesetzt werden.
	onlineUser[username]=online;
}

function getUserOnlineStatus(username){
	return onlineUser[username];
}

exports.getUsers = getUsers;
exports.registerUser = registerUser;
exports.getUserPrivateKey = getUserPrivateKey;
//exports.getUserPublicKey = getUserPublicKey;
exports.setUserOnlineStatus = setUserOnlineStatus;
exports.getUserOnlineStatus = getUserOnlineStatus;
exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
exports.userLogin = userLogin;
exports.userLogout = userLogout;
exports.checkUserLogin = checkUserLogin;
exports.getUserName = getUserName;