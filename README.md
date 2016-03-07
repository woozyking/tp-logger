# tp-logger

[![Build Status](https://travis-ci.org/woozyking/tp-logger.svg?branch=master)](https://travis-ci.org/woozyking/tp-logger)
[![Dependency Status](https://gemnasium.com/woozyking/tp-logger.svg)](https://gemnasium.com/woozyking/tp-logger)
[![Test Coverage](https://codeclimate.com/github/woozyking/tp-logger/badges/coverage.svg)](https://codeclimate.com/github/woozyking/tp-logger/coverage)
[![Code Climate](https://codeclimate.com/github/woozyking/tp-logger/badges/gpa.svg)](https://codeclimate.com/github/woozyking/tp-logger)

Supplement log messages with a Timestamp and caller's Path, with options for more.

__Note:__ supports only `Node.js >= 4.0` since 1.0.

### Install

`$ npm install -save tp-logger`

### Usage

```javascript
var logger = require('tp-logger')(/* optional options, see Options below */);

// Behaves the same as default console, where you can use string formatting
logger.log('lol: %d hours', 2);
// [2015-12-16T06:49:08+00:00][vanilla.js] lol: 2 hours

logger.info('dota');
// [2015-12-16T06:49:08+00:00][vanilla.js] dota

logger.warn('cs:go'); // added since 1.0
// [2015-12-16T06:49:08+00:00][vanilla.js] cs:go

logger.error(new Error('helldivers').stack);
// [2015-12-16T06:49:08+00:00][vanilla.js] Error: helldivers
//     at Object.<anonymous> (/Users/woozyking/proj/personal/tp-logger/examples/vanilla.js:9:14)
//     at Module._compile (module.js:425:26)
//     at Object.Module._extensions..js (module.js:432:10)
//     at Module.load (module.js:356:32)
//     at Function.Module._load (module.js:313:12)
//     at Function.Module.runMain (module.js:457:10)
//     at startup (node.js:138:18)
//     at node.js:974:3
```

If you don't mind your coworkers wondering why node.js `console` has suddenly become so awesome (or bad), you can also do:

```javascript
// NOT Recommended
console = require('tp-logger')(/* optional options, see Options below */);
// ...
```

`Since 1.0` The underlying implementation has changed to an ES6 style class that extends the Node.js native `Class: Console`, making it simpler to extend. See [Class: TPLogger](#class-tplogger) section for details.

```javascript
var TPLogger = require('tp-logger').TPLogger;
var logger = new TPLogger(/* optional options, see Options below */);

console.log(logger instanceof TPLogger); // true
console.log(logger instanceof require('console').Console); // true

logger.logOnce({
  fullPath: true // change on the fly behavior
}, 'Log Message');
// [2015-12-16T06:49:08+00:00][/full/path/to/class.js] Log Message

logger.meta({
  pid: true // also supports on the fly opt change
});
// [2015-12-16T06:49:08+00:00][class.js][12345]

class TPLogger2 extends TPLogger {
  // your implementation, etc
}
```

`Since 0.3` If you use express.js, you can also use the middleware provided to log errors passed on by request handlers in a centralize fashion:

```javascript
var app = require('express')();
var loggerMw = require('tp-logger').middleware(/* same optional options supported, see Options below */);

app.get('/', function(req, res, next) {
  // handling request
  // ...
  // something went wrong, a wild error appeared
  return next(error);
});

// plug in our logger middleware to log handler passed errors
app.use(loggerMw);
```

### Options

See them in action by running [this example](examples/options.js)

```javascript
var logger = require('tp-logger')({
  // stream for log() and info(). Not applicable for on the fly `Once` methods
  stdout: <writable stream instances. Default: process.stdout>,

  // stream for warn() and error(). Not applicable for on the fly `Once` methods
  stderr: <writable stream instances. Default: process.stderr>,

  // whether to use local time or UTC time
  local: <boolean. Default: false>,
  localTs: <Alias of 'local'. Since 0.2>,

  // timestamp format
  tsFormat: <string. See moment.js formatting documentation>,

  // whether to log full path of the caller or just caller filename
  fullPath: <boolean. Default: false. Since 0.2>,

  // whether to log with a supplement of [log|info|err]
  // enforced to true when stdout == stderr
  logType: <boolean. Default: true when stdout == stderr. Since 0.2>,

  // include process.pid
  pid: <boolean. Default: false. Since 1.0>
});
```

### Class: TPLogger

Subclass of native `Class: Console`. Since 1.0.

##### new TPLogger([opt])

Creates a new `TPLogger` instance by passing optional options `opt`, see [Options](#options) section for all available options.

##### logger.meta([opt][, method])

Generates meta info as string. Used as supplement before log messages. Since 1.0. Supports all [Options](#options) except `opt.stdout` and `opt.stderr`. The `method` argument is only useful when `opt.logType` is `true`, or both constructor `_opt.stdout` and `_opt.stderr` point to the same writable stream.

##### logger.log|info|warn|error(...)

Behaves exactly like native `Console`, plus `meta` method supplied supplement before intended log messages.

##### logger.logOnce|infoOnce|warnOnce|errorOnce(opt, ...)

Behaves like `TPLogger#log|info|warn|error`, but the first argument must be an object and treated as on the fly options to override constructor options behaviors (`opt.stdout` and `opt.stderr` are ignored).
