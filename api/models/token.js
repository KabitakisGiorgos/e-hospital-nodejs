var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var ttl = require('mongoose-ttl');

var tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: String,
    },
    clientId: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date
    }
});

tokenSchema.index({
    creationTime: 1
}, {
    expireAfterSeconds: 86400
});

module.exports = mongoose.model('accesstokens', tokenSchema);