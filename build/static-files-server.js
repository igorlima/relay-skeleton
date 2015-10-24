var express = require('express');
var request = require('request');
var bodyParser = require('express-graphql/dist/parseBody').parseBody;

var app = express()
  .use('/graphql', function(req, res) {
    bodyParser(req, function (error, data) {
      error && console.error(error);
      request({
        url: 'https://graphql-server.herokuapp.com/', //URL to hit
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql'
        },
        body: data.query //Set the body as a string
      }, function(error, response, body){
        error && console.error(error);
        res.send(body);
      });
    })
  } )
  .use(express.static(__dirname + '/public/'))
  .listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + (process.env.PORT || 3000) );
  });
