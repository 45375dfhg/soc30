var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var oldHenquirySchema = new Schema({
    aide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subcategoryId: {type: Schema.Types.ObjectId, ref: 'Subcategory'},
    text: { type: String, required: true, trim: true },
    postalcode: { type: String, required: true },
    creationTime: { type: Date, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    amountAide: { type: Number, default: 1},
    happened: {type: Boolean}
}, {versionKey: false});

var oldHenquiry = mongoose.model('oldHenquiry', oldHenquirySchema);
module.exports = oldHenquiry;