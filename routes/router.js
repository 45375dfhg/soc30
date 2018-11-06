var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var Entry = require('../models/entry');

// GET route for entries page
router.get('/entries', function (req, res, next) {
    Entry.find({})
    .populate('user', 'email username')
    .exec(function (err, list_entries) {
      // To show that the entries are fetched from the database. Is not rendered to the page yet.
      console.log(list_entries);
    });
    return res.sendFile(path.join(path.dirname(__dirname) + '/public/noindex.html'));
});

// POST route for entries page
router.post('/entries', function (req, res, next) {
    var entry = new Entry({
      category: req.body.category,
      message: req.body.message
    });
    // Search entries are only created in the name of one account for test purposes
    User.findById("5bdf1ab6e50e4feb14a87c48", function(err, result) {
      entry.user = result._id;
      entry.save(function (err) {
        if (err) {return next(err);}
        res.send(result + ' wurde gespeichert. Zurück zu <a href="/entries">Hilfegesuchen</a>.');
      });
    });
});

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(path.dirname(__dirname) + '/public/noindex.html'));
});

router.get('/login', function (req, res, next) {
  return res.sendFile(path.join(path.dirname(__dirname) + '/public/login.html'));
});

//POST route for logging in / register
router.post('/login', function (req, res, next) {
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
})

// GET route after registering
router.get('/profile', function (req, res, next) {
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
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a href="/entries">Hilfegesuche</a> <a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout
router.get('/logout', function (req, res, next) {
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
});

module.exports = router;
