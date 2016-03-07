var path = require('path');
var util = require('util');
var moment = require('moment');

/*
  Class: TPLogger

  Subclass of native Console. Since 1.0.

  new TPLogger(opt)

  opt = {
    stdout: <writable stream instances. Default: process.stdout>,
    stderr: <writable stream instances. Default: process.stderr>,
    localTs: <boolean. Default: false>,
    tsFormat: <string. See moment.js formatting documentation>,
    fullPath: <boolean. Default: false. Since 0.2>,
    logType: <boolean. Default: depends on whether stdout == stderr. Since 0.2>,
    pid: <boolean. Default: false. Since 1.0>
  }
*/
var TPLogger = function(opt) {
  opt = opt || {};
  var stdout = opt.stdout || process.stdout;
  var stderr = opt.stderr || process.stderr;

  TPLogger.super_.call(this, stdout, stderr);

  this._opt = opt;
};
util.inherits(TPLogger, require('console').Console);

/*
  Generate meta info as string. Used as supplement before log msg Since 1.0.

  `opt` follows the same rule as constructor argument.
*/
TPLogger.prototype.meta = function(opt, method) {
  // allows on the fly opt, defaults to this._opt
  opt = opt || this._opt;

  // supplement of time
  var ts = ((opt.local || opt.localTs) ? moment() : moment.utc()).format(opt.tsFormat);
  // supplement of path
  var callerPath = opt.fullPath ? process.mainModule.filename : path.basename(process.mainModule.filename);
  // assemble all supplements
  var supp = util.format('[%s][%s]', ts, callerPath);

  // if logType option is true, or when stdout and stderr are the same
  if (opt.logType || (this._opt.stdout && this._opt.stderr && (this._opt.stdout === this._opt.stderr))) {
    supp += util.format('[%s]', method || 'log');
  }

  // if pid option is true
  if (opt.pid) {
    supp += util.format('[%s]', process.pid);
  }

  return supp;
};

/*
  prepend supplements supplied by this.meta before intended message.

  Added warn method since 1.0.
*/
['log', 'info', 'warn', 'error'].forEach(function(method) {
  TPLogger.prototype[method] = function() {
    TPLogger.super_.prototype[method].apply(this, [
      this.meta(null, method),
      util.format.apply(this, arguments)
    ]);
  }
});

/*
  prepend supplements supplied by this.meta with on the fly opt before intended
  message. Since 1.0.
*/
['logOnce', 'infoOnce', 'warnOnce', 'errorOnce'].forEach(function(method) {
  TPLogger.prototype[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    var opt = args.shift() || {};

    TPLogger.super_.prototype[method.slice(0, -4)].apply(this, [
      this.meta(opt, method.slice(0, -4)),
      util.format.apply(this, args)
    ]);
  }
});

module.exports = function(opt) {
  return new TPLogger(opt);
};

module.exports.TPLogger = TPLogger;

// Express.js compatible error handling middleware. Since 0.3.
module.exports.middleware = function(opt) {
  var logger = new TPLogger(opt);

  return function(err, req, res, next) {
    logger.error(err.stack);
    next(err);
  };
};
