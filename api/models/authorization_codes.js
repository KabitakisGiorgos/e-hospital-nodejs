let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

let authcodeSchema = new Schema({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: ObjectId
});

module.exports = mongoose.model("authcodes", authcodeSchema);
