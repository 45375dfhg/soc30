var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HenquirySchema = new Schema({
    aide: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    potentialAide: [{type: Schema.Types.ObjectId, ref: 'User'}], // muss getestet werden
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subcategoryid: {type: Schema.Types.ObjectId, ref: 'Subcategory'},
    text: { type: String, required: true, trim: true },
    postalcode: { type: String, required: true },
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    amountAide: { type: Number, default: 1},
    confirmation: {type: Boolean}
});

var Henquiry = mongoose.model('Henquiry', HenquirySchema);
module.exports = Henquiry;