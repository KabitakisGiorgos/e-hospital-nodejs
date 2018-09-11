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
    created: {
        type: Date,
        default: Date.now()
    },
    meta: {
        type: Object,
    }
});

tokenSchema.index({
    created: 1
}, {
    expireAfterSeconds: 86400
});

module.exports = mongoose.model('accesstokens', tokenSchema);