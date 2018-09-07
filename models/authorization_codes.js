var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;

var authcodeSchema=new Schema({
    code:String,
    clientId:String,
    redirectUri:String,
    userId:ObjectId
});
module.exports=mongoose.model('authcodes',authcodeSchema);