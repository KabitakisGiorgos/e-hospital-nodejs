var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: This is incomplete.

var departmentSchema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
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

var model = mongoose.model('departments', departmentSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;