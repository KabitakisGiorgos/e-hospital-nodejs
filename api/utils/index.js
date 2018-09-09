// const passwordhash = require("./passwordhash");
// const helper = require("./helper");

// module.exports = {
//   passwordhash,
//   helper
// };


var requireDir = require('require-dir');
var dir = requireDir('./');

module.exports = dir;