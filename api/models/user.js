var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    password: {
        type: String,
        required: true,
    },
    salt:{
        type:String,
        required:true
    },
    username: {
        type: String,
        required: true,
        unique: true
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
    created: {
      type: Date,
      default: Date.now()
    },
    meta: {
        type: Object,
    },
});

var model = mongoose.model('users', userSchema);
model.on('index', () => {}); //For the unique property

module.exports = model;