var assert = require('assert');
var sinon = require('sinon');
var path = require('path');
var Writable = require('stream').Writable;

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

  describe('#meta([opt])', function() {
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
        new TPLogger({ localTs: true }).meta(),
        new TPLogger().meta({ localTs: true })
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
        new TPLogger({ fullPath: true }).meta(),
        new TPLogger().meta({ fullPath: true })
      ].forEach(function(actual) {
        assert(typeof actual === 'string');
        assert(actual.match(pattern)[2].split(path.sep).length > 1);
      });
    });

    it('should return a string with log type when opt.logType is true', function() {
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\w+)\]/;

      [
        new TPLogger({ logType: true }).meta(),
        new TPLogger().meta({ logType: true })
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
      var actual = logger.meta();
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\w+)\]/;
      var type = actual.match(pattern)[2];

      assert(typeof actual === 'string');
      assert(['log', 'info', 'error'].indexOf(type) >= 0);

      // meta's on the fly opt doesn't affect this behavior
      logger = new TPLogger();
      actual = logger.meta({
        stdout: process.stdout,
        stderr: process.stdout
      });

      assert(typeof actual === 'string');
      assert(!pattern.test(actual));
    });

    it('should return a string with pid when opt.pid is true', function() {
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+|-)\d{2}:\d{2}\]\[.+\]\[(\d+)\]/;

      [
        new TPLogger({ pid: true }).meta(),
        new TPLogger().meta({ pid: true })
      ].forEach(function(actual) {
        assert(parseInt(actual.match(pattern)[2]) === process.pid);
        assert(typeof actual === 'string');
      });
    });
  });

  describe('#log|info|warn|error()', function() {
    it('should have supplements before intended message', function() {
      var actual = '';
      var writable = new Writable({
        write: function(chunk, encoding, next) {
          actual = chunk.toString();
          next();
        }
      });
      var logger = new TPLogger({
        stdout: writable,
        stderr: writable
      });
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00\]\[.+\]\[(log|info|warn|error)\]\WLoL/;
      var methods = ['log', 'info', 'warn', 'error'];

      for (var i = 0; i < methods.length; i++) {
        logger[methods[i]]('LoL');
        assert(pattern.test(actual));
      }

      writable.end();
    });

    it('should invoke #meta() method exactly once', function() {
      var writable = new Writable({
        write: function(chunk, encoding, next) {
          next();
        }
      });
      var logger = new TPLogger({
        stdout: writable,
        stderr: writable
      });
      var methods = ['log', 'info', 'warn', 'error'];

      for (var i = 0; i < methods.length; i++) {
        sinon.spy(logger, 'meta');
        logger[methods[i]]('LoL');

        assert(logger.meta.calledOnce);

        logger.meta.restore();
      }

      writable.end();
    });
  });

  describe('#logOnce|infoOnce|warnOnce|errorOnce()', function() {
    it('alter the supplements by supplying first argument as opt', function() {
      var actual = '';
      var writable = new Writable({
        write: function(chunk, encoding, next) {
          actual = chunk.toString();
          next();
        }
      });
      var logger = new TPLogger({
        stdout: writable,
        stderr: writable
      });
      var noOptPattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00\]\[.+\]\[(log|info|warn|error)\]\WLoL/;
      var pattern = /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00\]\[.+\]\[(log|info|warn|error)\]\[\d+\]\WLoL/;
      var methods = ['logOnce', 'infoOnce', 'warnOnce', 'errorOnce'];
      var opt = { pid: true };

      for (var i = 0; i < methods.length; i++) {
        logger[methods[i]](opt, 'LoL');
        assert(pattern.test(actual));

        // test that non-once method follows the constructor opt
        logger[methods[i].slice(0, -4)]('LoL');
        assert(noOptPattern.test(actual));
      }

      writable.end();
    });

    it('should invoke #meta() method exactly once', function() {
      var writable = new Writable({
        write: function(chunk, encoding, next) {
          next();
        }
      });
      var logger = new TPLogger({
        stdout: writable,
        stderr: writable
      });
      var methods = ['logOnce', 'infoOnce', 'warnOnce', 'errorOnce'];
      var opt = { pid: true };

      for (var i = 0; i < methods.length; i++) {
        sinon.spy(logger, 'meta');
        logger[methods[i]](opt, 'LoL');

        assert(logger.meta.calledOnce);
        assert(logger.meta.calledWith(opt, methods[i].slice(0, -4)));

        logger.meta.restore();
      }

      writable.end();
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

describe('Express middleware', function() {
  // TODO
});
