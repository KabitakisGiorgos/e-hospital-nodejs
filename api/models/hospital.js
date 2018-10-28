const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: This is incomplete.

const hospitalSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  wards: {
    type: Array
  },
  clinics: {
    type: Array
  },
  created: {
    type: Date,
    default: Date.now()
  },
  meta: {
    type: Object
  }
});

const model = mongoose.model("hospitals", hospitalSchema);
model.on("index", () => {}); //For the unique property

module.exports = model;
