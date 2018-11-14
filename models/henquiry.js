var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HenquirySchema = new Schema({
    aide: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    potentialAide: [{type: Schema.Types.ObjectId, ref: 'User'}], // muss getestet werden
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String }, // String?
    text: { type: String, required: true, trim: true },
    postalcode: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    amountAide: { type: Number }
});

var Henquiry = mongoose.model('Henquiry', HenquirySchema);
module.exports = Henquiry;