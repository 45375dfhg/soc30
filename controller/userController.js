var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var path = require('path');

exports.login_get = function(req, res, next) {
    if(req.session.userId) {
        console.log("User ist eingeloggt.");
    } else {
        console.log("User ist nicht eingeloggt.");
    }
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
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
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
          return next(err);
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
    if(!req.session.userId) {
      var err = new Error('Please log in.')
      err.status = 401;
      return next(err);
    }
    var projection;
    if(req.query.userId === req.session.userId) {
      projection = '';
      console.log("TRUE");
    } else {
      projection = 'firstname nickname auth foto avatar address.postalcode ratings';
      console.log("FALSE");
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
  var data;
  if(req.body.email) {data.email = req.body.email;}
  if(req.body.surname) {data.surname = req.body.username;}
  if(req.body.firstname) {data.firstname = req.body.firstname;}
  //if(req.body.password == req.body.passwordConf) {data.password = req.body.password;}
  if(req.body.nickname) {data.nickname = req.body.nickname;}
  data.address.postalcode = 1;
  data.street = "1";
  data.city = "1";
  data.housenm = "1";
  if(req.body.foto) {data.foto = req.body.foto;}
  if(req.body.mobile) {data.mobile = req.body.mobile;}
  if(req.body.avatar) {data.avatar = req.body.avatar;}
  console.log(data);
  User.updateOne(req.session.userId, data, function (error, user) {
    if(error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error('User does not exist.');
        err.status = 404;
        return next(err);
      } else {
          res.json(updatedUser);
      }
    }
  });
};