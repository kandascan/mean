var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CostTypeSchema = new Schema({
    name: { type: String, required: true, unique: true},
});

module.exports = mongoose.model('CostType', CostTypeSchema);

