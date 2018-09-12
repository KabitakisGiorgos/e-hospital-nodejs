const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    name: String,
    clientSecret: String,
    clientId: String,
});
module.exports = mongoose.model('clients', clientsSchema);