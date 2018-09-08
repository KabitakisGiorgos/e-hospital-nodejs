var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId = Schema.ObjectId;
var ttl = require('mongoose-ttl');

var tokenSchema=new Schema({
    token:String,
    userId:ObjectId,
    clientId:String,
    creationTime:{type:Date}
});

module.exports=mongoose.model('accesstokens',tokenSchema);