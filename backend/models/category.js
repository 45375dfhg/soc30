var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    name: {type: String},
    categoryId: {type: Number},
    subcategory: [{
        name: {type: String},
        categoryId: {type: Number}
    }],
});

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;