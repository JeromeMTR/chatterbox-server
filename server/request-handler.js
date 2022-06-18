const fs = require('fs');

let requestHandler = function(request, response) {
  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept, authorization',
    'access-control-max-age': 10 // Seconds.
  };

  const respondCallback = function(statusCode, send) {
    console.log('Serving request type ' + request.method + ' for url ' + request.url);
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    send ? response.end(send) : response.end();
  };

  const postCallback = function(parsedData) {
    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(parsedData), (err) => {
      if (err) {
        console.log('err: ' + err);
      } else {
        console.log('Succesful post. Finished writing to the file');
        respondCallback(201);
      }
    });
  };

  const readFileCallback = function(parsedData) {
    if (request.url === '/classes/messages') {
      const method = request.method;
      if (method === 'POST') {
        request.on('data', (data) =>{
          parsedData.push(JSON.parse(data));
          postCallback(parsedData);
        });
      }
      if (method === 'GET') {
        console.log('successful get');
        respondCallback(200, JSON.stringify(parsedData));
      }
    } else {
      respondCallback(404);
    }
  };

  fs.readFile(`${__dirname}/data.json`, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    readFileCallback(parsedData);
  });

};

module.exports.handleRequest = requestHandler;