var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  surname: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, trim: true },
  ratings: [{type: Number}],
  address: { // muss alles required sein
      postalcode: { type: Number },
      street: { type: String },
      city: { type: String, trim: true },
      housenm: { type: String }
  },
  postident: {type: Boolean},
  invite: {
    // 0: Wurzel, 1: Freund 1. Grades, 2: Freund 2. Grades, sonst undefined
    level: {type: Number},
    codes: [{type: Number}],
    children: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  foto: {type: String}, // binary war hier
  mobile: {type: String},
  // Ist halt die Frage, ob Avatare im Front- oder Backend gespeichert werden
  avatar: {type: Schema.Types.ObjectId, ref: 'Avatar' },
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