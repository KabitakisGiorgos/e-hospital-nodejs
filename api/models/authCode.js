const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const authcodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  redirectUri: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

authcodeSchema.index(
  {
    created: 1
  },
  {
    expireAfterSeconds: 86400
  }
);

module.exports = mongoose.model("authcodes", authcodeSchema);
