let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let ttl = require("mongoose-ttl");

let tokenSchema = new Schema({
  token: String,
  userId: ObjectId,
  clientId: String,
  creationTime: { type: Date }
});

module.exports = mongoose.model("accesstokens", tokenSchema);
