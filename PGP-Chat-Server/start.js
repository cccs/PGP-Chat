var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/js/"] = requestHandlers.javascriptFile;
handle["/register/"] = requestHandlers.registerUser;

server.start(router.route, handle);
