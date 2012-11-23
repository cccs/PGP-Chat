var mysql = require("mysql");
var constants = require("./constants.js");

/*
fügt einen Chat-User zur Datenbank hinzu
Maximale Länge des Benutzernamens: 30 Zeichen
Jeder Username kann nur einmal vorkommen
*/
function addUser(name, public_key, private_key, password, callback){
    name = mysql_real_escape_string(name);
    public_key = mysql_real_escape_string(public_key);
    private_key = mysql_real_escape_string(private_key);
    password = mysql_real_escape_string(password);
    var query = "INSERT INTO users (name, password, public_key, private_key) VALUES ('"+name+"', '"+password+"', '"+public_key+"', '"+private_key+"')";
    console.log(query);
    getUserPW(name,function(res){
        if(res==null){
            callback(doSingleInsertQuery(query));
        }else{
            callback(0);//der Username ist bereits vorhanden
        }
    });
    
}

/*
Return werte:
1, falls erfolg!
0, falls Fehler!
*/
function createSession(user, sessionID, callback){
    if(sessionID == null, sessionID.length > constants.DATABASE_TABLE_SESSIONS_SESSIONID_MAXLEN){
        callback(0);
        return;
    }
    user = mysql_real_escape_string(user);
    sessionID = mysql_real_escape_string(sessionID);
    getUserNumber(user,function(number){
        if(number==null)callback(0); //Username nicht vorhanden
        var query = "INSERT INTO sessions (usernumber, sessionID, deleteTime) VALUES ('"+number+"', '"+sessionID+"', null)";
        callback(doSingleInsertQuery(query));
    });
}

/*kein Callback, da nicht notwendig auf die */
function deleteSession(sessionID){
    
}

function getUsernameFromEnabledSession(sessionID, callback){
    sessionID = mysql_real_escape_string(sessionID);
    var query = "SELECT users.name as name FROM sessions, users WHERE IsNull(sessions.deleteTime) AND sessions.sessionID = '"+sessionID+"' AND users.number = sessions.usernumber";
    doSelectSingleRowQuery(query, function(res){
        if(res == null){
            callback(false);
        }else{
            callback(res.name);
        }
    });
}

function getAllUsers(callback){
    var query = "SELECT name, public_key FROM users";
    doSelectQuery(query, function(err, results, fields) {
        if(err != null || results.length < 1 || results[0] == undefined){
            console.log("Error in select_query: "+query+"\nError: " + err);
            callback(null);   
        }else{
        var names = new Array();
        var pubKeys = new Array();
        for(i=0;i<results.length;i++){
            names.push(results[i].name);
            pubKeys.push(results[i].public_key);
        }
        callback(names, pubKeys);
        }
    });
}

function getUserPrivateKey(name, callback){
    name = mysql_real_escape_string(name);
    var query = "SELECT private_key FROM users WHERE name = '"+name+"'";
    doSelectSingleRowQuery(query, function(res){
        if(res == null){
            callback(null);
        }else{
            callback(res.private_key);
        }
    });
}

/*
Jeder Benutzer hat eine eindeutige ID, welche über diese Funktion abgefragt werden kann.
Diese wird nur innerhalb der Datenbank benutzt. Der Username ist schließlich auch eindeutig
*/
function getUserNumber(name, callback){
    name = mysql_real_escape_string(name);
    var query = "SELECT number FROM users WHERE name = '"+name+"'";
    doSelectSingleRowQuery(query, function(res){
        if(res == null || res.number == undefined){
            console.log("No Results from query: "+query);
            callback(null);
        }else{
            callback(parseInt(res.number));
        }
    });
}

function getUserName(number, callback){
    number = parseInt(number);
    var query = "SELECT name FROM users WHERE number = "+number+"";
    doSelectSingleRowQuery(query, function(res){
        if(res == null){
            console.log("No Results from query: "+query);
            callback(null);
        }else{
            callback(res.name);
        }
    });
}

/*
gibt das Password des Users: name zurück
null , falls der user nicht vorhanden ist.
*/
function getUserPW(name, callback){
    name = mysql_real_escape_string(name);
    var query = "SELECT password FROM users WHERE name = '"+name+"'";
    doSelectSingleRowQuery(query, function(res){
        if(res == null){
            callback(null);
        }else{
            callback(res.password);
        }
    });
}

/*
registriert eine Nachricht. Der Zeitpunkt wird automatisch gesetzt.
author = die eindeutige Nummer des Versenders
receiver = die eindeutige Nummer des Empfänger
message_body = der Text
*/
function addMessage(author, receiver, message_body, callback){
    getUserNumber(author, function(ret){
        author = parseInt(ret);
        getUserNumber(receiver, function(ret){
            receiver = parseInt(ret);

            if(author != NaN && receiver != NaN){
               message_body = mysql_real_escape_string(message_body);
               callback(doSingleInsertQuery("INSERT INTO Messages (author, receiver, message_body) VALUES ('"+author+"', '"+receiver+"', '"+message_body+"')"));
            }else{
                callback(0);
            }

        });
    });
}

/*

*/
function getMessages(receiver, callback){
    getUserNumber(receiver, function(res){
    receiver = res;
    receiver = parseInt(receiver);
    var query = "SELECT Messages.Number, users.name as Author, Messages.message_body as Message_body FROM Messages, users WHERE Messages.receiver = "+receiver+" AND Messages.author = users.number ORDER BY Messages.Number ASC";
    doSelectQuery(query, function(err, results, fields) {
        if(err != null || results.length < 1 || results[0] == undefined){
            console.log("Error in select_query: "+query+"\nError: " + err);
            var authors = new Array();
            var messages = new Array();
            callback(authors, messages); //leere Arrays zurückgeben
        }else{
            var authors = new Array();
            var messages = new Array();
            for(i=0;i<results.length;i++){
            authors.push(results[i].Author);
            messages.push(results[i].Message_body);
            }
            callback(authors, messages);
    }
    });
    });
}

function doSingleInsertQuery(insert_query){
    var connection = connectToDB();
    
    connection.query(insert_query, function(err, results, fields) {
        
        if(err != null){
            console.log("Error in Insert_query: "+insert_query+"\nError: " + err);
            return 0;   
        }else{
            return 1;
        }
    });
    connection.end();
    return 1;
}

function doSelectSingleRowQuery(select_query, callback){
    doSelectQuery(select_query, function(err, results, fields) {
        if(err != null || results == null || results.length < 1 || results[0] == undefined){
            console.log("Error in select_query: "+select_query+"\nError: " + err);
            callback(null);   
        }else{
        callback(results[0]);
        }
    });
}

function doSelectQuery(select_query, callback){
    var connection = connectToDB();
    connection.query(select_query, callback);
    connection.end();
}

function connectToDB(){
    var connection = mysql.createConnection({
    user: constants.DATABASE_USER_NAME,
    password: constants.DATABASE_USER_PASSWORD,
    host: 'localhost',
    database: constants.DATABASE_NAME
    });

    return connection;
}

function mysql_real_escape_string (str) {
    if(str==undefined || str == null || toString.call(str) != '[object String]')return "";
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

exports.getUserPW = getUserPW;
exports.getUserPrivateKey = getUserPrivateKey;
exports.addMessage = addMessage;
exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.getUserName = getUserName;
exports.getMessages = getMessages;
exports.getUsernameFromEnabledSession = getUsernameFromEnabledSession;
exports.createSession = createSession;
exports.deleteSession = deleteSession;