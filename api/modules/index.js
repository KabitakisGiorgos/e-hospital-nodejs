
var requireDir = require('require-dir');
var dir = requireDir('./', {recurse: true});

module.exports = dir;

/**
 * exports looks like this: 
 * {
 *  ...
 *  <moduleName>: {
 *    routes,
 *    functions
 *  },
 *  ...
 * }
 */