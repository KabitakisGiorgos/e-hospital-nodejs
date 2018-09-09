var requireDir = require('require-dir');
var dir = requireDir('.', {
  mapKey: function (value, baseName) {
    return typeof value === 'string' ? `${value}Model` : `${baseName}Model`;
  }
});

module.exports = dir;