var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GetRatingSchema = new Schema({
    rating: {
        ratingid: {type: Number, ref: 'Rating'},
        amountAide: { type: Number}
    }
});



var GetRating = mongoose.model('GetRating', GetRatingSchema);
module.exports = GetRating;