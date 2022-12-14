const fs = require('fs');

module.exports.requestHandler = (request, response) => {
  const {method, url} = request;
  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept, authorization',
    'access-control-max-age': 10
  };

  const respondCallback = function(statusCode, send) {
    console.log('Serving request type ' + method + ' for url ' + url);
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    send ? response.end(send) : response.end();
  };

  const postCallback = function(parsedData) {
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(parsedData), (err) => {
      if (err) {
        console.log('err: ' + err);
      } else {
        respondCallback(201);
      }
    });
  };

  const readFileCallback = function(parsedData) {
    if (url === '/classes/messages') {
      if (method === 'POST') {
        request.on('data', (data) =>{
          parsedData.push(JSON.parse(data));
          postCallback(parsedData);
        });
      }
      if (method === 'GET') {
        respondCallback(200, JSON.stringify(parsedData));
      }
    } else {
      respondCallback(404);
    }
  };

  fs.readFile(`${__dirname}/data.json`, 'utf8', (err, data) => {
    err ? console.err(err) : readFileCallback(JSON.parse(data));
  });

};