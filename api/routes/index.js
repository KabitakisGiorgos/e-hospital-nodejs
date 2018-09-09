// const oauth2 = require("./oauth2");
// const user = require("./user");

// module.exports = {
//   oauth2,
//   user
// };

var requireDir = require('require-dir');
var dir = requireDir('./');

module.exports = dir;