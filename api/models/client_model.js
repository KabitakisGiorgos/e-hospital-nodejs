let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let clientsSchema = new Schema({
  name: String,
  clientSecret: String,
  clientId: String,
  isTrusted: Boolean
});

module.exports = mongoose.model("clients", clientsSchema);
