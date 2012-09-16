var tls = require('tls');
var fs = require('fs');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";

var options = {
  key: fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem'),
  cert: fs.readFileSync(runningDirectory+'sslKeys/certificate.pem')
};

tls.createServer(options, function (s) {
if (s.authorized) {
    console.log("Connection authorized by a Certificate Authority.");
  } else {
    console.log("Connection not authorized: " + s.authorizationError)
  }
    console.log();
  s.write("welcome!\n\n");
  s.pipe(s);
}).listen(8000);
