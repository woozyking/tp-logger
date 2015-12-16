// node.js built-in
var path = require('path');
var format = require('util').format;
var Console = require('console').Console;
// 3rd party
var moment = require('moment');

/*
  Module entry point responsible for taking in some options to adjust behavior

  Example
  opt = {
    stdout: <writable stream instances. Default to process.stdout>,
    stderr: <writable stream instances. Default to process.stderr>,
    local: <boolean. Default behavior is as false>,
    tsFormat: <string. See moment.js formatting documentation>
  }
*/
var tpLogger = (function(opt) {
  opt = opt || {};

  // This is nothing but a simple duplicate of standard console found in node.js
  // but can be lightly configured to use own streams to replace stdout/stderr
  var logger = new Console(
    opt.stdout || process.stdout,
    opt.stderr || process.stderr
  );

  // override the following console methods
  ['log', 'info', 'error'].forEach(function(method) {
    // original method
    var orig = logger[method].bind(logger);

    // add a healthy dose of supplements to log messages
    logger[method] = function() {
      // apply revised arguments to the method
      orig.apply(logger, [
        format(
          '[%s][%s]',
          // supplement of time
          (opt.local ? moment() : moment.utc()).format(opt.tsFormat),
          // supplement of path
          path.basename(process.mainModule.filename)
        ),
        format.apply(format, Array.prototype.slice.call(arguments))
      ]);
    }
  });

  return logger;
});

module.exports = tpLogger;
