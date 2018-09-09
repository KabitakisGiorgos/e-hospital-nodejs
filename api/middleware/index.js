// const oauth = require("./oauth");
// const oauth2 = require("./oauth2");
// const router = require("./router");
// const strategies = require("./strategies");
// const error = require("./error");

// module.exports = {
//   oauth,
//   oauth2,
//   router,
//   strategies,
//   error
// };


var requireDir = require('require-dir');
var dir = requireDir('./');

module.exports = dir;