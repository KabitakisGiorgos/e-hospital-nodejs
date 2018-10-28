const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  bkgEntityId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  patientId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  timeslot: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("bookings", bookingSchema);