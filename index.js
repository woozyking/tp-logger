/* jshint esversion: 6 */
/* jshint node: true */
'use strict';

var path = require('path');
var util = require('util');
var _Console = require('console').Console;
var moment = require('moment');

/*
  Class: TPLogger

  Subclass of native Console. Since 1.0.
*/
class TPLogger extends _Console {
  /*
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
  constructor(opt) {
    opt = opt || {};
    var stdout = opt.stdout || process.stdout;
    var stderr = opt.stderr || process.stderr;

    super(stdout, stderr);

    this._opt = opt;
  }

  /*
    Generate meta info as string. Used as supplement before log msg Since 1.0.

    `opt` follows the same rule as constructor argument.
  */
  meta(opt, method) {
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
  }

  log() {
    super.log.apply(this, [
      this.meta(null, 'log'),
      util.format.apply(this, arguments)
    ]);
  }

  info() {
    super.info.apply(this, [
      this.meta(null, 'info'),
      util.format.apply(this, arguments)
    ]);
  }

  // Since 1.0.
  warn() {
    super.warn.apply(this, [
      this.meta(null, 'warn'),
      util.format.apply(this, arguments)
    ]);
  }

  error() {
    super.error.apply(this, [
      this.meta(null, 'error'),
      util.format.apply(this, arguments)
    ]);
  }

  // on the fly opt override. Since 1.0.
  logOnce() {
    var args = Array.prototype.slice.call(arguments);
    var opt = args.shift() || {};

    super.log.apply(this, [
      this.meta(opt, 'log'),
      util.format.apply(this, args)
    ]);
  }

  infoOnce() {
    var args = Array.prototype.slice.call(arguments);
    var opt = args.shift() || {};

    super.info.apply(this, [
      this.meta(opt, 'info'),
      util.format.apply(this, args)
    ]);
  }

  warnOnce() {
    var args = Array.prototype.slice.call(arguments);
    var opt = args.shift() || {};

    super.warn.apply(this, [
      this.meta(opt, 'warn'),
      util.format.apply(this, args)
    ]);
  }

  errorOnce() {
    var args = Array.prototype.slice.call(arguments);
    var opt = args.shift() || {};

    super.error.apply(this, [
      this.meta(opt, 'error'),
      util.format.apply(this, args)
    ]);
  }
}

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
