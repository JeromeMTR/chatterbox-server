/* Import node's http module: */
var http = require('http');
var {requestHandler} = require(`${__dirname}/request-handler.js`);

var port = 3000;
var ip = '127.0.0.1';
var server = http.createServer(requestHandler);

server.listen(port, ip, () => console.log('Listening on http://' + ip + ':' + port));
