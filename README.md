# tp-logger

Supplement log messages with a __T__imestamp and caller's __P__ath.

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
console = require('tp-logger')(/* optional options, see Options below */);
// ...
```

## Options

All options are optional, as demonstrated above.

```javascript
var logger = require('tp-logger')({
  // stream for log() and info()
  stdout: <writable stream instances. Default to process.stdout>,
  // stream for error()
  stderr: <writable stream instances. Default to process.stderr>,
  // whether to use local time or UTC time
  local: <boolean. Default behavior is as false>,
  // timestamp format, since moment.js is used for this
  // see moment.js formatting documentation
  tsFormat: <string>
});
```
