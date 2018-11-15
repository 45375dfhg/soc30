var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {type: String},
    image: {type: String} //Binary war hier
});

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;