# v0.4 (2016-03-05)

* __Adds__ `pid` option. When `true`, messages logged are supplemented by `process.pid`.
* __Adds__ `logOnce(opt)`, `infoOnce(opt)`, and `errorOnce(opt)` methods for on the fly opt adaptation that once.
* __Adds__ `meta(method[, opt])` method that returns log message supplement portion.
* __Adds__ `Class: TPLogger` that can be required and extended if necessary.
* _Internal_ full rewrite using ES6 style class extension.

# v0.3 (2016-02-20)

* __Adds__ Express.js compatible error handling middleware to log error stacks passed on by route request handlers.
* __Updates__ License year.

# v0.2 (2015-12-18)

* __Adds__ `fullPath` option. When `true`, messages logged are supplemented by caller's full path rather than just "base name" (module's file name). Defaults to `false`.
* __Adds__ `localTs` option, alias of `local` option for now, and in future versions will be the preferred one as `local` is ambiguous.
* __Adds__ new behavior when both `stdout` and `stderr` point to the same stream, in which case messages logged contain a third supplement of [`info|log|error`] log type specification.
* __Adds__ `logType` option. When `true`, logger behaves the same as when both `stdout` and `stderr` point to the same stream. Default depends on whether `stdout` and `stderr` point to the same stream or not.

# v0.1 (2015-12-16)

Initial release.
