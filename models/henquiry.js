var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HenquirySchema = new Schema({
    // Die vom Filer angenommenen Aider
    aide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Für den Filer, damit er sehen kann, ob sich neue potentialAider eingetragen haben.
    // TODO: Wann wird es auf false gesetzt? Klären mit Claas
    updated: {type: Boolean, default: false},
    // Bereits bewertete Aider
    ratedAide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // Filer, die bereits den Aide bewertet haben
    ratedFiler: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // User, die sich beworben haben, um zu helfen
    potentialAide: [{type: Schema.Types.ObjectId, ref: 'User'}],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creationTime: { type: Date, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    amountAide: { type: Number, default: 1},
    // Es kann sich niemand mehr bewerben. Das Henquiry ist nicht mehr
    // auffindbar in der Suche
    closed: {type: Boolean, default: false},
    // Das Henquiry wird gelöscht, aber bleibt weiterhin in der Datenbank, z.B.
    // wenn bei der Hilfe etwas passiert ist, oder die Hilfe beginnen sollte, aber 
    // keine Helfer ausgesucht wurden
    removed: {type: Boolean, default: false},
    // Wenn die Hilfe erfolgreich stattgefunden hat
    happened: {type: Boolean, default: false},
    // Wert an Terra. 1 Terra pro 30 Minuten (wird beim Erstellen festgelegt)
    terra: {type: Number},
    category: {
      category: {type: Number},
      subcategory: {type: Number}
    },
    // Distanz wird beim Laden der Hilfsgesuche jedes mal neu berechnet.
    distance: {type: Number}
}, {versionKey: false}, {
    writeConcern: {
      w: 1,
      j: true,
      wtimeout: 1000
  }});

var Henquiry = mongoose.model('Henquiry', HenquirySchema);
module.exports = Henquiry;