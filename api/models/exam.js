var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: This is incomplete.

var examSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    patientId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now()
    },
    meta: {
        type: Object,
    }
});

var model = mongoose.model('exams', examSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;