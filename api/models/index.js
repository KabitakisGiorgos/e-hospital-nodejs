const requireDir = require('require-dir');
const dir = requireDir('.', {
  mapKey: function (value, baseName) {
    return typeof value === 'string' ? `${value}Model` : `${baseName}Model`;
  }
});

module.exports = dir;