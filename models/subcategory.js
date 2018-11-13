var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubcategorySchema = new Schema({
    name: {type: String},
    image: {type: Binary},
    categoryid: {type: Number, ref: 'Category'}

});

var Subcategory = mongoose.model('Subcategory', SubcategorySchema);
module.exports = Subcategory;