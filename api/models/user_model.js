let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: String,
  password: String,
  name: String
});

module.exports = mongoose.model("users", userSchema);
