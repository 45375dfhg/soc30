var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var path = require('path');
var bcrypt = require('bcryptjs');

exports.login_get = function(req, res, next) {
    return res.sendFile(path.join(path.dirname(__dirname) + '/public/login.html'));    
};

exports.register_post = function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.password &&
    req.body.passwordConf && req.body.surname && req.body.firstname && req.body.nickname) {

    var userData = {
      email: req.body.email,
      password: req.body.password,
      surname: req.body.surname,
      firstname: req.body.firstname,
      nickname: req.body.nickname
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  } 
};

exports.login_post = function (req, res, next) {
if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          console.log(user);
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.json();
          //return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
};

exports.logout = function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
};

exports.profile_get = function (req, res, next) { 
    // TODO Muss noch raus, da Prüfung auf Login früher erfolgt
    if(!req.session.userId) {
      var err = new Error('Please log in.')
      err.status = 401;
      return next(err);
    }
    var projection;
    if(req.query.userId === req.session.userId) {
      // TODO Anzuzeigende Informationen aussuchen
      projection = 'email';
    } else {
      projection = 'firstname nickname auth foto avatar address.postalcode ratings';
    }
    User.findById(req.query.userId, projection)
      .exec(function (error, user) {
        if (error) {
          return next(error); // Möglicher Fehler: Übergebene userId hat falsche Länge
        } else {
          if (user === null) {
            var err = new Error('User does not exist.');
            err.status = 404;
            return next(err);
          } else {
            return res.json(user);
          }
        }
      });
};

exports.profile_edit_post = function (req, res, next) {
  if(!req.session.userId) {
    var err = new Error('Please log in.')
    err.status = 401;
    return next(err);
  }
  var data = {};
  data.address = {};
  populateDataToBeUpdated(req, data);
  // Altes PW muss noch geprüft werden
  if(req.body.password) {
    if(req.body.password === req.body.passwordConf) {
      bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) {
          return next(err);
        }
        console.log(hash);
        data.password = hash;
        updateUser(req, data, res);
      })
    } else {
      res.send("PWs sind nicht gleich");
    }
  } else {
    updateUser(req, data, res);
  }
  console.log("hier");
};

function populateDataToBeUpdated(req, data) {
  if(req.body.email) {data.email = req.body.email;}
  if(req.body.surname) {data.surname = req.body.surname;}
  if(req.body.firstname) {data.firstname = req.body.firstname;}
  if(req.body.nickname) {data.nickname = req.body.nickname;}
  if(req.body.postalcode) {data.address.postalcode = req.body.postalcode;}
  if(req.body.street) {data.address.street = req.body.street;}
  if(req.body.city) {data.address.city = req.body.city;}
  if(req.body.housenm) {data.address.housenm = req.body.housenm;}
  if(req.body.foto) {data.foto = req.body.foto;}
  if(req.body.mobile) {data.mobile = req.body.mobile;}
  if(req.body.avatar) {data.avatar = req.body.avatar;}
}

function updateUser(req, data, res) {
  User.findByIdAndUpdate(req.session.userId, {$set : data}, function (error, user) {
    if(error) {
      console.log(error);
      return;
    } else {
      if (user === null) {
        var err = new Error('User does not exist.');
        err.status = 404;
        return next(err);
      } else {
          res.json(user);
      }
    }
  });
}