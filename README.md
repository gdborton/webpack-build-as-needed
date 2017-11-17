## Building only as needed with WebpackDevServer

Sometimes, for super huge builds, webpack is slow. One method I've used for speeding up the dev experience, is force a webpack-dev-server to only build the entry points that developers request instead of the entire build.

This can dramatically increase dev boot up times, as you're potentially limiting the amount of work to a small percentage of the total build.

## Understanding this demo

This demo application is super simple. There are two bundles in our webpack config (added via a glob, this expands infinitely and programmatically), `file1.bundle.js` and `files2.bundle.js`. Neither contain logic, and that's ok.

When you boot the server, we remove all but one entry from the config, and store a reference to everything that is removed. As you request bundles that have been removed, we add them to our compiler, and invalidate.

This triggers a rebuild with your new bundle, and delays serving responses until the compiler is ready.

You can see this in action by starting the server then loading these files in order.

 1. http://localhost:3000/dist/file1.bundle.js
 2. http://localhost:3000/dist/file2.bundle.js

This should trigger the following output.
```
building: multi /src/file1.bundle.js
Listening on port: 3000
building: /src/file1.bundle.js

webpack: Compiled successfully.
Found a request for an unbuilt bundle "file2.bundle", adding to compiler: "myFancyCompiler"
webpack: Compiling...
building: /src/file1.bundle.js
building: multi /src/file2.bundle.js
webpack: wait until bundle finished: /dist/file2.bundle.js
building: /src/file2.bundle.js
```

The vast majority of the work being done is in `./server.js`'s `createBuildOnRequestMiddleware`.

Note: It's difficult to read from the pasted logs, but `file2.bundle.js` isn't build until you request it.

## Gotcha's

1. You need to be careful when using the CommonsChunk plugin.
 - This plugin needs a lot of context. If you're using it, you should be compiling any affected chunks together. Otherwise you could hit unexpected module scope issues in production. They're rare, but confusing to debug since it would behave different in dev.
2. Webpack currently doesn't timestamp without changes.
 - Webpack uses file timestamps to determine whether a module has changed and needs to be rebuilt. It's currently only setting these when it detects a change with its watcher. This means that until you save a file, any new entry points added will trigger a full rebuild.
 - This repo exists partially as a resource to correct this "bug".
