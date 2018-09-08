let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let clientsSchema = new Schema({
  name: String,
  clientSecret: String,
  clientId: String,
  isTrusted: Boolean
});
exports = mongoose.model("clients", clientsSchema);
