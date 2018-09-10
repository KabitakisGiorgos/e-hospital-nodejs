var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: This is incomplete.

var doctorSchema = new Schema({
    speciality: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    diplomas: {
        type: Array,
        required: true,
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
});

var model = mongoose.model('doctors', doctorSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;