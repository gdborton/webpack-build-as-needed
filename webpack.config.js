const path = require('path');
const glob = require('glob');

const LogModuleBuildPlugin = require('./log-module-build-plugin');

const entryFiles = glob.sync('./src/*'); // use w/e pattern makes sense in your code base.

const config = {
  name: 'myFancyCompiler',
  entry:{},
  output: {
    path: path.resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].js',
  },
  plugins: [
    new LogModuleBuildPlugin()
  ]
};

/**
 * Takes an array of files [src/file1.bundle.js]
 * and adds an entry config for each one...
 * {
 *   'file1.bundle': ['absolute/path/to/src/file1.bundle.js']
 * }
 * Note: We're using an array for all entry points.
 */
entryFiles.forEach(file => {
  const key = path.basename(file).replace(path.extname(file), '');
  const value  = path.resolve(file);
  config.entry[key] = [value];
});

module.exports = config;
