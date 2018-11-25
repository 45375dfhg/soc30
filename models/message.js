var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    aide: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    filer: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    henquiry: {type: Schema.Types.ObjectId, ref: 'Henquiry', required: true},
    // ob der Aide die letzte Nachricht gelesen hat
    readAide: {type: Boolean, default: false},
    // ob der Filer die letzte Nachricht gelesen hat
    readFiler: {type: Boolean, default: false},
    // sobald das Henquiry als stattgefunden markiert wurde, kann
    // nicht mehr gechattet werden
    readOnly: {type: Boolean, default: false},
    messages: [{
        message: {type: String},
        // 1: aide, 2: filer, 3: Systemnachricht an aide, 4: Systemnachricht an filer
        // Systemnachrichten werden nur an den entsprechenden Teilnehmer gesendet
        participant: {type: Number},
        timeSent: {type: Date}
    }]
});

var Message = mongoose.model('Message', MessageSchema);
module.exports = Message;