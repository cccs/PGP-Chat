var url = require("url");
var fs = require("./fileSystem.js");

function route(handle, request, response) {
var pathname = fs.getPathFrom(url.parse(request.url).pathname);

  console.log("About to route a request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](request, response);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
  }
}

exports.route = route;
