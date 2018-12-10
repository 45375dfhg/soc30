var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  surname: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, trim: true },
  // Index des Arrays = Das Kriterium
  ratings: [{type: Number}], // Das ist ratingsAsAide (ungünstige Namensgebung i know)
  ratingsAsFiler: [{type: Number}],
  // TODO: muss am Ende alles required sein
  address: { 
      postalcode: { type: Number },
      street: { type: String },
      city: { type: String, },
      housenm: { type: String }
  },
  // TODO: Am Ende muss das in der Registrierung und allen anderen Routen berücksichtigt werden.
  // Lässt sich in verifyToken.js prüfen
  invite: {
    // 0: Wurzel, 1: Freund 1. Grades, 2: Freund 2. Grades, 3: Nicht verifiziert, kann also nichts machen
    level: {type: Number},
    codes: [{type: Number}],
    children: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  // TODO: Überlegen, ob man die Handynummer haben möchte - da nicht prüfbar auf Echtheit
  mobile: {type: String},
  // Avatare werden im Frontend gespeichert und hier als Zahl, die vom FE einem Bild zugeordnet wird.
  avatar: {type: Number, default: 0},
  terra: {type: Number, default: 0},
  coordinates: {
    latitude: {type: Number},
    longitude: {type: Number}
  },
  // meetings speichert, wie oft man an einem Tag hilft
  meetings: [{date: String, count: Number}]
},{
  writeConcern: {
    w: 1,
    j: true,
    wtimeout: 1000
}, strict: false
});

var User = mongoose.model('User', UserSchema);
module.exports = User;