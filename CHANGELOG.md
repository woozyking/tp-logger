# v0.4 (2016-03-06)

This version went through a rewrite using ES6 style class instead of the previous "monkey-patching" way.

* __Adds__ `Class: TPLogger` that can be required and extended if necessary.
* __Adds__ `pid` option. When `true`, messages logged are supplemented by `process.pid`.
* __Adds__ `warn` method.
* __Adds__ `logOnce`, `infoOnce`, `warnOnce`, and `errorOnce` methods for on the fly opt adaptation that once.
* __Adds__ `meta` method that returns log message supplement portion.

# v0.3 (2016-02-20)

* __Adds__ Express.js compatible error handling middleware to log error stacks passed on by route request handlers.
* __Updates__ License year.

# v0.2 (2015-12-18)

* __Adds__ `fullPath` option. When `true`, messages logged are supplemented by caller's full path rather than just "base name" (module's file name). Defaults to `false`.
* __Adds__ `localTs` option, alias of `local` option for now, and in future versions will be the preferred one as `local` is ambiguous.
* __Adds__ new behavior when both `stdout` and `stderr` point to the same stream, in which case messages logged contain a supplement of [`info|log|error`] log type specification.
* __Adds__ `logType` option. When true, supplement with the log type. Enforced to true when `stdout` and `stderr` point to the same writable stream.

# v0.1 (2015-12-16)

Initial release.
