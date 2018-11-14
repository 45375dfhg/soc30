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

exports.login_register_post = function (req, res, next) {
    // Register:
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
        //passwordConf: req.body.passwordConf, 
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
      // Login:
    } else if (req.body.logemail && req.body.logpassword) {
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

exports.profile = function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Not authorized! Go back!');
            err.status = 400;
            return next(err);
          } else {
            return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a href="/henquiries">Hilfegesuche</a> <a type="button" href="/logout">Logout</a>')
          }
        }
      });
};

exports.calendar = (req, res, next) => {
    Henquiry.find({'potentialAide' : { $in: req.session.userId}}, function(err, docs) {
      return res.json(docs);
    });
};