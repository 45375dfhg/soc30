var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

  surname: { type: String, required: true, trim: true },
  firstname: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true, trim: true },
  ratings: [{ 
    rating: {type: Schema.Types.ObjectId, ref: 'Rating'}, 
    count: {type: Number} 
  }],
    address: { // muss alles required sein
        postalcode: { type: Number  },
        street: { type: String },
        city: { type: String, trim: true },
        housenm: { type: String }
    },
  postident: {type: Boolean},
  auth: {type: Boolean},
  foto: {type: String}, // binary war hier
  mobile: {type: String},
  avatar: {type: Schema.Types.ObjectId, ref: 'Avatar' },




});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
};

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;