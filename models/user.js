var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  surname: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, trim: true },
  // Index des Arrays = Das Kriterium
  ratings: [{type: Number}],
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
    // 0: Wurzel, 1: Freund 1. Grades, 2: Freund 2. Grades, sonst undefined
    level: {type: Number},
    codes: [{type: Number}],
    children: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  mobile: {type: String},
  // Avatare werden im Frontend gespeichert und hier als Zahl, die vom FE einem Bild zugeordnet wird.
  avatar: {type: Number},
  terra: {type: Number, default: 0},
  coordinates: {
    latitude: {type: Number},
    longitude: {type: Number}
  }
}, {versionKey: false},{
  writeConcern: {
    w: 1,
    j: true,
    wtimeout: 1000
}});

var User = mongoose.model('User', UserSchema);
module.exports = User;