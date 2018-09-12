// const passwordhash = require("./passwordhash");
// const helper = require("./helper");

// module.exports = {
//   passwordhash,
//   helper
// };


const requireDir = require('require-dir');
const dir = requireDir('./');

module.exports = dir;