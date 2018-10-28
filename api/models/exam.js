const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: This is incomplete.

const examSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  clinicId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  description: {
    type: String
  },
  state: {
    type: String,
    default: "pending"
  },
  meta: {
    type: Object
  }
});

const model = mongoose.model("exams", examSchema);
model.on("index", () => {}); //For the unique property

module.exports = model;
