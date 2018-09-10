var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: This is incomplete.

var patientSchema = new Schema({
    AMKA: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        // unique: true
    },
    exams: {
        type: Array,
    },
});

var model = mongoose.model('patients', patientSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;