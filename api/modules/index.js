
const requireDir = require('require-dir');
const dir = requireDir('./', {recurse: true});

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