/*
  examples/vanilla.js demonstrate out of the box vanilla experience you get from
  tp-logger
*/
var logger = require('../index.js')();

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
