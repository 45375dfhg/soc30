var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    aide: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    filer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    messages: [{
        message: {type: String},
        participant: {type: Number}, // 1: aide, 2: filer, 3: Systemnachricht an aide, 4: Systemnachricht an filer
        read: {type: Boolean, default: false},
        readOnly: {type: Boolean, default: false}
    }],
    henquiry: {type: Schema.Types.ObjectId, ref: 'Henquiry', required: true}
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;