var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HenquirySchema = new Schema({
    aide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    updated: {type: Boolean, default: false},
    ratedAide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    potentialAide: [{type: Schema.Types.ObjectId, ref: 'User'}],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creationTime: { type: Date, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    amountAide: { type: Number, default: 1},
    closed: {type: Boolean, default: false},
    removed: {type: Boolean, default: false},
    happened: {type: Boolean, default: false},
    category: {
      category: {type: Number},
      subcategory: {type: Number}
    },
    distance: {type: Number}
}, {versionKey: false}, {
    writeConcern: {
      w: 1,
      j: true,
      wtimeout: 1000
  }});

var Henquiry = mongoose.model('Henquiry', HenquirySchema);
module.exports = Henquiry;