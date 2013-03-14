var nowjs = require("now");
var chat = require("./chat.js");

var everyone;
var usergroups = new Object(); // In dieser Variablen werden alle Clients gespeichert, welche sich mit dem selben Usernam angemeldet haben.

function start(server){

everyone = nowjs.initialize(server);


everyone.connected(function(){
	  console.log("Joined: " + this.now.name + " Client-ID: "+this.user.clientId);
	});


	everyone.disconnected(function(){
		if(this.now.name != null || this.now.name != undefined){
			//chat.setUserOnlineStatus(this.now.name, false);
			
		}
	  console.log("Left: " + this.now.name);
	});

//everyone.now.distributeMessage = function(message){
//	everyone.now.receiveMessage(this.now.name, message);
//};

everyone.now.sendMessage = function(receiver, message){
	var clientID = this.user.clientId;
	var timestamp = new Date();
	chat.getUserName(this.user.clientId, function(username){
		chat.sendMessage(username, clientID, receiver, message,function(ret){
			if(ret == 1){
			console.log("User "+username+" sendet Nachricht an "+receiver);
			//sendMessageToUser(receiver, username, message);
			nowjs.getGroup(receiver).now.updateMessages();
			}else{
				console.log("User "+username+" konnte Nachricht nicht an "+receiver+" senden");
			}
		});
	});
};

everyone.now.getUsers = function(){
	chat.getUsers( this.now.receiveUsers);
}

function sendMessageToUser(username, message){
	try{
		nowjs.getGroup(username).now.receiveMessage(JSON.stringify(message));
	}catch(e){
		console.log("Fehler beim Senden von Nachricht an Benutzer "+username+": "+e);
	}
}

everyone.now.getMessages = function(){
	var clientID = this.user.clientId;
	chat.getUserName(clientID, function(username){
		if(username != null && username != undefined){
		chat.checkUserLogin(username, clientID, function(ret){
			if(ret == 1){
				//chat.getMessages(username, function(names, messages){
				//	for(i=0; i<names.length && i<messages.length;i++){
				//		sendMessageToUser(username, names[i], messages[i]);
				//	}
				chat.getMessages(username, function(messages){
					for(i=0; i<messages.length;i++){
						sendMessageToUser(username, messages[i]);
					}
				});
			}else{
				console.log("Wrong session for user: "+username+" , SessionID: "+clientID);
			}
		});
		
	}
	});
}

//everyone.now.getQuestion = 

everyone.now.userLogin = function(username, password){
	var clientID = this.user.clientId;
	var user = this;
	chat.getUserPrivateKey(username, password, function(privKey, pubKey){
		if(privKey != null){
			chat.setUserOnlineStatus(username, true);
			console.log("Loginversuch: Username: "+username+" Password: "+ password+" clientID: "+clientID);
			chat.userLogin(username, clientID, function(ret){
				if(ret){
					//hier noch die this.user.clientId speichern (ersetzt den Cookie):
					var group = nowjs.getGroup(username);
					group.addUser(clientID);
					var userdata = {};
					userdata.private_key = privKey;
					userdata.username = username;
					userdata.public_key = pubKey;
					user.now.loginSuccess(JSON.stringify(userdata), null);
				}else{
					user.now.loginSuccess(null, null,"Fehler beim Anlegen der Session!");
				}
			});
		}else{
			//Login failed
			user.now.loginSuccess(null, null,"Falscher Username oder Passwort");
		}
	});
};

}

exports.start = start;