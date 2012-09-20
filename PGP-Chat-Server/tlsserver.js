var tls = require('https');
var fs = require('fs');

var runningDirectory = "/home/andreas/PGP-Chat/PGP-Chat-Server/";

var options = {
  key: fs.readFileSync(runningDirectory+'sslKeys/privatekey.pem'),
  cert: fs.readFileSync(runningDirectory+'sslKeys/certificate.pem')
};

tls.createServer(options, function (req, res) {

res.writeHead(200);
  res.end("welcome!\n");
}).listen(8000);
