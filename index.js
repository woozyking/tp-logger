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
    stdout: <writable stream instances. Default: process.stdout>,
    stderr: <writable stream instances. Default: process.stderr>,
    local: <boolean. Default: false>,
    localTs: <Alias of 'local'. Since 0.2>,
    tsFormat: <string. See moment.js formatting documentation>,
    fullPath: <boolean. Default: false. Since 0.2>,
    logType: <boolean. Default: depends on whether stdout == stderr. Since 0.2>
  }
*/
var tpLogger = (function(opt) {
  opt = opt || {};
  opt.stdout = opt.stdout || process.stdout;
  opt.stderr = opt.stderr || process.stderr;

  // This is nothing but a simple duplicate of standard console found in node.js
  var logger = new Console(opt.stdout, opt.stderr);

  // override the following console methods
  ['log', 'info', 'error'].forEach(function(method) {
    // original method
    var orig = logger[method].bind(logger);

    // add a healthy dose of supplements to log messages
    logger[method] = function() {
      // supplement of time
      var ts = ((opt.local || opt.localTs) ? moment() : moment.utc()).format(opt.tsFormat);
      // supplement of path
      var callerPath = opt.fullPath ? process.mainModule.filename : path.basename(process.mainModule.filename);
      // assemble all supplements
      var supp = format('[%s][%s]', ts, callerPath);

      // if logType option is true, or when stdout and stderr are the same
      if (opt.logType || (opt.stdout == opt.stderr)) {
        // supplement of log type
        supp += format('[%s]', method);
      }

      // Prepend supplements, followed by original log message
      orig.apply(logger, [
        supp,
        format.apply(format, Array.prototype.slice.call(arguments))
      ]);
    };
  });

  return logger;
});

module.exports = tpLogger;
