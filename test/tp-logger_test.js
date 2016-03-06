var assert = require('assert');
var path = require('path');
var Readable = require('stream').Readable;

// test targets
var tpLogger = require('../index');
var TPLogger = tpLogger.TPLogger;
var middleware = tpLogger.middleware;

describe('Class: TPLogger', function() {
  describe('new TPLogger([opt])', function() {
    it('should create an instance of TPLogger and Console', function() {
      var logger = new TPLogger();

      assert(logger instanceof TPLogger);
      assert(logger instanceof require('console').Console);
    });

    it('should have property _opt default to {}', function() {
      var logger = new TPLogger();

      assert.deepEqual(logger._opt, {});
    });

    it('should have property _stdout default to process.stdout and _stderr default to process.stderr', function() {
      var logger = new TPLogger();

      assert(logger._stdout == process.stdout);
      assert(logger._stderr == process.stderr);
    });

    it('should have property _opt set to be opt', function() {
      var opt = {
        localTs: true,
        tsFormat: 'YYYY-HH',
        fullPath: true,
        logType: true,
        pid: true
      };
      var logger = new TPLogger(opt);

      assert.deepEqual(logger._opt, opt);
    });
  });

  describe('#meta(method[, opt])', function() {
    it('should return a string with default supplements without arguments supplied', function() {
      var logger = new TPLogger();
      var actual = logger.meta();
      var pattern = /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00)\]\[(.+)\]/;

      assert(typeof actual === 'string');
      assert(pattern.test(actual));
    });

    it('should return a string with local timestamp when opt.localTs is true', function() {
      var pattern = /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)(\d{2}:\d{2}))\]\[(.+)\]/;

      [
        new TPLogger({ localTs: true }).meta('log'),
        new TPLogger().meta('log', { localTs: true })
      ].forEach(function(actual) {
        var parts = actual.match(pattern);
        var offset = parts[3].split(':');
        offset = parseInt(offset[0]) * 60 + parseInt(offset[1]);

        if (parts[2] != '-') {
          offset = 0 - offset;
        }

        assert(typeof actual === 'string');
        assert(pattern.test(actual));
        assert(offset === new Date().getTimezoneOffset());
      });
    });

    it('should return a string with full path when opt.fullPath is true', function() {
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[(.+)\]/;

      [
        new TPLogger({ fullPath: true }).meta('log'),
        new TPLogger().meta('log', { fullPath: true })
      ].forEach(function(actual) {
        assert(typeof actual === 'string');
        assert(actual.match(pattern)[2].split(path.sep).length > 1);
      });
    });

    it('should return a string with log type when opt.logType is true', function() {
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\w+)\]/;

      [
        new TPLogger({ logType: true }).meta('log'),
        new TPLogger().meta('log', { logType: true })
      ].forEach(function(actual) {
        assert(typeof actual === 'string');
        assert(actual.match(pattern)[2] === 'log');
      });
    });

    it('should return a string with log type when both constructor opt.stdout and opt.stderr point to the same writable stream', function() {
      var logger = new TPLogger({
        stdout: process.stdout,
        stderr: process.stdout
      });
      var actual = logger.meta('log');
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\w+)\]/;
      var type = actual.match(pattern)[2];

      assert(typeof actual === 'string');
      assert(['log', 'info', 'error'].indexOf(type) >= 0);

      // meta's on the fly opt doesn't affect this behavior
      logger = new TPLogger();
      actual = logger.meta('log', {
        stdout: process.stdout,
        stderr: process.stdout
      });

      assert(typeof actual === 'string');
      assert(!pattern.test(actual));
    });

    it('should return a string with pid when opt.pid is true', function() {
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\d+)\]/;

      [
        new TPLogger({ pid: true }).meta('log'),
        new TPLogger().meta('log', { pid: true })
      ].forEach(function(actual) {
        assert(parseInt(actual.match(pattern)[2]) === process.pid);
        assert(typeof actual === 'string');
      });
    });
  });
});

describe('Function wrapper: tpLogger([opt])', function() {
  it('should create an instance of TPLogger and Console', function() {
    var logger = tpLogger();

    assert(logger instanceof TPLogger);
    assert(logger instanceof require('console').Console);
  });

  it('should have property _opt default to {}', function() {
    var logger = tpLogger();

    assert.deepEqual(logger._opt, {});
  });

  it('should have property _stdout default to process.stdout and _stderr default to process.stderr', function() {
    var logger = tpLogger();

    assert(logger._stdout == process.stdout);
    assert(logger._stderr == process.stderr);
  });

  it('should have property _opt set to be opt', function() {
    var opt = {
      localTs: true,
      tsFormat: 'YYYY-HH',
      fullPath: true,
      logType: true,
      pid: true
    };
    var logger = tpLogger(opt);

    assert.deepEqual(logger._opt, opt);
  });
});
