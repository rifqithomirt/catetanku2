const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const jwt = require('jsonwebtoken');

fs.readFile( __dirname +'/template.pug', function (error, content) {
  if (error) console.log(error)
  templatePug = content;
});

var mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};


https.createServer({
  key: fs.readFileSync( process.env.KEY || (__dirname + '/key.pem') ),
  cert: fs.readFileSync(  process.env.CERT || (__dirname + '/cert.pem') ),
  passphrase: '4kuG4kr0h'
}, function (request, response) {
  if (request.method.toLowerCase() == 'post') {
    var data = '';
    request.on('data', chunk => {
      data += chunk;
    })
    request.on('end', () => {
      
      var obj = JSON.parse(data)
      
      var base64String = obj.base64;
      var base64Image = base64String.split(';base64,').pop();
      fs.writeFile( __dirname + `/upload/${obj.filename}.png`, base64Image, {
        encoding: 'base64'
      }, function (err) {
        console.log(`/upload/${obj.filename}.png`)
        console.log( err, 'File created');
        response.writeHead(200, {
          'Content-Type': 'plain/text'
        });
        response.end(JSON.stringify({
          'message': 'File Created'
        }));
      });
    })
  } else {
    var filePath = request.url;
    filePath = filePath.split("?")[0];
    var extname = String(path.extname(filePath)).toLowerCase();

    var contentType = mimeTypes[extname] || 'application/octet-stream';
    if (filePath.split('.').length > 1) {
      filePath = path.join(__dirname, filePath);
      console.log(filePath, request.url)

      fs.readFile(filePath, function (error, content) {
        if (error) {
          if( extname == '.jpg' || extname == '.png' ) {
            filePath = path.join(__dirname, '/assets/img/gallery.png');
            filePath = filePath.split("?")[0];
            fs.readFile( filePath, function (error, content) {
              response.writeHead(200, {
                'Content-Type': contentType
              });
              response.end(content, 'utf-8');
            });
          } else {
            response.writeHead(404);
            response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
          }

        } else {
          console.log(contentType)
          response.writeHead(200, {
            'Content-Type': contentType
          });
          response.end(content, 'utf-8');
        }
      });
    } else {

      if (request.url == '/login/') {
        fs.readFile( __dirname + '/web/login.html', function (error, loginContent) {
          if (error) {
            console.log(error)
            fs.readFile( __dirname + '/404.html', function (error, content) {
              response.writeHead(404, {
                'Content-Type': 'text/html'
              });
              response.end(content, 'utf-8');
            });
          } else {
            //console.log(loginContent.toString())
            response.writeHead(200, {
              'Content-Type': 'text/html'
            });
            response.end(loginContent);
          }
        });
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.end(pug.render(templatePug, {
          dir: path.join('/pages' + filePath, 'index.js'),
          dircss: path.join('/pages' + filePath, 'index.css')
        }));
      }
    }
  }
}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');

var auth = function (req, res, callback) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      callback({
        result: false,
        message: 'Invalid ID'
      });
    } else {
      callback({
        result: true
      });
    }
  } catch {
    callback({
      result: false,
      message: 'Invalid Request'
    });
  }
};