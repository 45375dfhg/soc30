var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvatarSchema = new Schema({
    image: { type: String }, //Binary war hier
});

var Avatar = mongoose.model('Avatar', AvatarSchema);
module.exports = Avatar;