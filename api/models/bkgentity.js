const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bkgEntitySchema = new Schema({
  hospitalId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true //Every clinic must have one bkgEntity
  },
  // wardId: {
  //   type: Schema.Types.ObjectId,
  //   // required: true,
  //   unique: true //Every ward must have one bkgEntity
  // },
  frequency: {
    type: Number,
    min: 1,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: true
  },
  availability: {
    type: Number,
    required: true
  },
  opening: {
    type: String,
    required: true
  },
  closing: {
    type: String,
    required: true
  },
  days: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
  //TODO: Ask parasyri if anything else is needed
});

module.exports = mongoose.model("bkgentities", bkgEntitySchema);