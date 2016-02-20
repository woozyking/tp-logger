/*
  examples/express_middleware.js demonstrate how to use middleware.
*/
// this requires express to be installed
var app = require('express')();
var middleware = require('../index').middleware(/* accept same options */);
var logger = require('../index')();

// route that does nothing but generates an error and pass on to error handling
// middlewares
app.get('/', function(req, res, next) {
  return next(new Error('Intentional Error.'));
});

// apply tp-logger middleware to always write error to stderr with err.stack
// and pass on the error to the next error handling middleware
app.use(middleware);

// cache the passed on error and show a friendlier error message in form of JSON
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: err.message
  });
});

app.listen(8000, function() {
  logger.log('listening');
});
