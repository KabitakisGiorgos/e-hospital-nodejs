const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: This is incomplete.

const doctorSchema = new Schema({
  specialty: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  wardId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  diplomas: {
    type: Array
    // required: true,
  },
  created: {
    type: Date,
    default: Date.now()
  },
  meta: {
    type: Object
  }
});

const model = mongoose.model("doctors", doctorSchema);
model.on("index", () => {}); //For the unique property

module.exports = model;
