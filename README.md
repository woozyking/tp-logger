# tp-logger

Supplement log messages with a Timestamp and caller's Path.

## Install

`$ npm install -save tp-logger`

## Usage

```javascript
var logger = require('tp-logger')(/* optional options, see Options below */);

// Behaves the same as default console, where you can use string formatting
logger.log('lol: %d hours', 2);
// [2015-12-16T06:49:08+00:00][vanilla.js] lol: 2 hours

logger.info('dota');
// [2015-12-16T06:49:08+00:00][vanilla.js] dota

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

`Since 0.3.0` If you use express.js, you can also use the middleware provided to log errors passed on by request handlers in a centralize fashion:

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

## Options

See them in action by running [this example](examples/options.js)

```javascript
var logger = require('tp-logger')({
  // stream for log() and info()
  stdout: <writable stream instances. Default: process.stdout>,

  // stream for error()
  stderr: <writable stream instances. Default: process.stderr>,

  // whether to use local time or UTC time
  local: <boolean. Default: false>,
  localTs: <Alias of 'local'. Since 0.2>,

  // timestamp format
  tsFormat: <string. See moment.js formatting documentation>,

  // whether to log full path of the caller or just caller filename
  fullPath: <boolean. Default: false. Since 0.2>,

  // whether to log with a third supplement of [log|info|err]
  // default to true when stdout == stderr, otherwise false
  logType: <boolean. Default: depends on whether stdout == stderr. Since 0.2>
});
```
