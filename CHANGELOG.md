# v0.3

* __Adds__ Express.js compatible error handling middleware to log error stacks passed on by route request handlers.
* __Updates__ License year.

# v0.2

* __Adds__ `fullPath` option. When `true`, messages logged are supplemented by caller's full path rather than just "base name" (module's file name). Defaults to `false`.
* __Adds__ `localTs` option, alias of `local` option for now, and in future versions will be the preferred one as `local` is ambiguous.
* __Adds__ new behavior when both `stdout` and `stderr` point to the same stream, in which case messages logged contain a third supplement of [`info|log|error`] log type specification.
* __Adds__ `logType` option. When `true`, logger behaves the same as when both `stdout` and `stderr` point to the same stream. Default depends on whether `stdout` and `stderr` point to the same stream or not.
