var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubcategorySchema = new Schema({
    name: {type: String},
    image: {type: String}, //Binary war hier
    categoryID: {type: Schema.Types.ObjectId, ref: 'Category'}

});

var Subcategory = mongoose.model('Subcategory', SubcategorySchema);
module.exports = Subcategory;