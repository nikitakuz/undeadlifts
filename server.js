var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var port = process.argv[2] || 5000;
var redirects = require('./firebase').redirects;
var rewrites = require('./firebase').rewrites;

var contentTypesByExtension = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript'
};

http.createServer(function (request, response) {

  var uri = url.parse(request.url).pathname;

  // Redirect to trailing slash to simulate Firebase hosting environment;
  if (uri.length > 1 && uri.indexOf('.') === -1 && uri.slice(-1) !== '/') {
    response.writeHead(301, { Location: uri + '/' });
    response.end();
    return;
  }

/*
  // Check if rewrite exists
  for (var i = 0; i < rewrites.length; i++) {
    if (uri === rewrites[i].source || uri === rewrites[i].source + '/') {
      uri = rewrites[i].destination;
    }
  }

*/
  var filename = path.join(process.cwd(), '/build' + uri);

  path.exists(filename, function (exists) {
    if (!exists) {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.write('404 Not Found\n');
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    fs.readFile(filename, 'binary', function (err, file) {
      if (err) {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write(err + '\n');
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers['Content-Type'] = contentType;
      response.writeHead(200, headers);
      response.write(file, 'binary');
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log('Static file server running at http://localhost:' + port);