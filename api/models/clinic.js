const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: This needs evaluation

const wardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hospitalId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  wardId: {
    type: Schema.Types,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  meta: {
    type: Object,
  }
});

const model = mongoose.model('clinics', wardSchema);
module.exports = model;