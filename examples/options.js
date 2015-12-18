/*
  examples/options.js demonstrate options' impact on log messages.
*/
var fs = require('fs');

var stdout = fs.createWriteStream('./stdout.log');
var stderr = fs.createWriteStream('./stderr.log');
var logger = require('../index.js')({
  stdout: stdout,
  stderr: stderr,
  localTs: true,
  tsFormat: 'dddd, MMMM Do YYYY, h:mm:ss a Z',
  fullPath: true,
  logType: true
});

logger.log('lol: %d hours', 2); // in ./stdout.log
// [Friday, December 18th 2015, 1:59:28 am -05:00][/Users/woozyking/proj/personal/tp-logger/examples/options.js][log] lol: 2 hours

logger.info('dota'); // in ./stdout.log
// [Friday, December 18th 2015, 1:59:28 am -05:00][/Users/woozyking/proj/personal/tp-logger/examples/options.js][info] dota

logger.error(new Error('helldivers').stack); // in ./stderr.log
// [Friday, December 18th 2015, 1:59:28 am -05:00][/Users/woozyking/proj/personal/tp-logger/examples/options.js][error] Error: helldivers
//     at Object.<anonymous> (/Users/woozyking/proj/personal/tp-logger/examples/options.js:23:14)
//     at Module._compile (module.js:398:26)
//     at Object.Module._extensions..js (module.js:405:10)
//     at Module.load (module.js:344:32)
//     at Function.Module._load (module.js:301:12)
//     at Function.Module.runMain (module.js:430:10)
//     at startup (node.js:141:18)
//     at node.js:980:3
