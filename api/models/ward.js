const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: This is incomplete.

const wardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    hospitalId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    doctors: {
        type: Array
    },
    patients: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now()
    },
    meta: {
        type: Object,
    }
});

const model = mongoose.model('wards', wardSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;