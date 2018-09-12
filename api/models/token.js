const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
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