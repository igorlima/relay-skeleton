import express from 'express';
import { Schema } from './data/schema';
import graphQLHTTP from 'express-graphql';

const app = express();

// https://github.com/relayjs/relay-starter-kit/pull/20/files
app.use(function(req, res, next) {
  var oneof = false;
  if(req.headers.origin &&
     req.headers.origin.match(/^https?:[/][/]localhost/)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    oneof = true;
  }
  if(req.headers['access-control-request-method']) {
    res.header(
      'Access-Control-Allow-Methods',
      req.headers['access-control-request-method']
    );
    oneof = true;
  }
  if(req.headers['access-control-request-headers']) {
    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers']
    );
    oneof = true;
  }
  if(oneof) {
    res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }

  // Intercept OPTIONS method.
  if (oneof && req.method == 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/', graphQLHTTP({ schema: Schema, pretty: true }));
app.listen(8080, (err) => {
  if (err)
    return console.error(err);
  console.log('GraphQL Server is now running on localhost:8080');
});