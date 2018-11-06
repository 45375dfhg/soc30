var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String },
    message: { type: String, required: true, trim: true }
});

var Entry = mongoose.model('Entry', EntrySchema);
module.exports = Entry;