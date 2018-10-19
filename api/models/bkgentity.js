const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daySchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true
  },
  availability: {
    type: Number,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true
  }
}, {
  _id: false
});

const bkgEntitySchema = new Schema({
  wardId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  frequency: {
    type: Number,
    min: 1,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true
  },
  days: {
    type: mongoose.Schema.Types.Mixed
  }
  //TODO: Ask parasyri if anything else is needed
});

module.exports = mongoose.model("bkgentities", bkgEntitySchema);