var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CostSchema = new Schema({
    username: { type: String, required: true},
    costname: { type: String, required: true},
    costprice: { type: Number, required: true},
});

module.exports = mongoose.model('Cost', CostSchema);
