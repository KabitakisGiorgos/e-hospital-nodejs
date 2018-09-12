var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: This is incomplete.

var hospitalSchema = new Schema({
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
    departments: {
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

var model = mongoose.model('hospitals', hospitalSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;