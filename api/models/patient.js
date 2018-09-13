const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: This is incomplete.

const patientSchema = new Schema({
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
    type: {
        type: String,
    },
    exams: {
        type: Array,
    },
    created: {
        type: Date,
        default: Date.now()
    },
    meta: {
        type: Object,
    }
});

const model = mongoose.model('patients', patientSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;