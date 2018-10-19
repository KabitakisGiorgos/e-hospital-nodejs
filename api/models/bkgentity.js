const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bkgEntitySchema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  wardId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique:true//Every ward must have one bkgEntity
  },
  frequency: {
    type: Number,
    min: 1,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true
  },
  days: {
    type: mongoose.Schema.Types.Mixed,
    default:{}
  }
  //TODO: Ask parasyri if anything else is needed
});

module.exports = mongoose.model("bkgentities", bkgEntitySchema);