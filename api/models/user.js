var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,

    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt:{
        type:String,
        required:true
    }
});

var model = mongoose.model('users', userSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;