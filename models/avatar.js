var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AvatarSchema = new Schema({
    image: { type: Binary },
});

var Avatar = mongoose.model('Avatar', AvatarSchema);
module.exports = Avatar;