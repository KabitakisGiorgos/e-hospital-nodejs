var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var userSchema=new Schema({
    username:String,
    password:String,
    name:String
});
module.exports=mongoose.model('users',userSchema);