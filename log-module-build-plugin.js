/**
 * This is a simple plugin to log the name of a module whenever it is built
 * by webpack. Without changes to a file, we expect to only see this once per
 * file.
 */
module.exports = class LogModuleBuildPlugin {
  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('build-module', (module) => {
        console.log(`building: ${module.identifier()}`);
      });
    });
  }
};
