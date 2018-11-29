var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    name: {type: String},
    ratingId: {type: Number}
});

var Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;