var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientsSchema = new Schema({
    name: String,
    clientSecret: String,
    clientId: String,
    isTrusted: Boolean
});
module.exports = mongoose.model('clients', clientsSchema);