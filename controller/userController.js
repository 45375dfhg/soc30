// For authentication
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var path = require('path');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
/*
const {body, validationResult} = require('express-validator/check');

exports.validate = (method) => {
  switch(method) {
    case 'register': {
      return [
        body('email').exists().isEmail(),
        body('password').exists(),
        body('passwordConf').exists(),
        body('surname').exists(),
        body('firstname').exists(),
        body('nickname').exists()
      ]
    }
  }
}
*/
exports.register = function (req, res, next) {
  /*const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }*/
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }

  if (req.body.email &&
    req.body.password &&
    req.body.passwordConf && req.body.surname && req.body.firstname && req.body.nickname) {
    req.body.email = req.body.email.toLowerCase();
    // Prüfung, ob die E-Mail bereits in der Datenbank existiert
    User.findOne({email:req.body.email}, function(errEmail, resultEmail) {
      if(errEmail) {return next(errEmail);}
      if(!resultEmail) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var userData = {
          email: req.body.email,
          password: hashedPassword,
          surname: req.body.surname,
          firstname: req.body.firstname,
          nickname: req.body.nickname,
        }
        User.create(userData, function (error, user) {
          if (error) return res.status(500).send("There was a problem registering the user.")
          // create a token
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token , _id: user._id});
        });
      } else {
        var err = new Error('Diese E-Mail existiert bereits.');
        err.status = 400;
        return next(err);
      }
  });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
};

exports.login = function (req, res, next) {
if (req.body.logemail && req.body.logpassword) {
  User.findOne({ email: req.body.logemail }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.logpassword, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token, _id: user._id });
  });
    } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
};

exports.logout = function (req, res, next) {
      res.status(200).send({ auth: false, token: null });
};

exports.getProfile = function (req, res, next) { 
    var projection;
    if(!(req.body.userId === req.userId)) {
      projection = 'nickname ratings postident avatar';
    } else {
      projection = 'surname firstname email nickname ratings address postident invite mobile avatar terra';
    }
    User.findById(req.body.userId, projection)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (!user) {
            var err = new Error('User does not exist.');
            err.status = 404;
            return next(err);
          } else {
            return res.json(user);
          }
        }
      });
};

// TODO: Muss noch umgesetzt werden
exports.editProfile = function (req, res, next) {
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
        data.password = hash;
        updateUser(req, data, res);
      })
    } else {
      res.send("PWs sind nicht gleich");
    }
  } else {
    return res.status(403).send("Passwort nicht eingegeben.");
  }
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
  User.findByIdAndUpdate(req.userId, {$set : data}, function (error, user) {
    if(error) {
      console.log(error);
      return;
    } else {
      if (user === null) {
        var err = new Error('User does not exist.');
        err.status = 404;
        return next(err);
      } else {
          User.findById(req.userId, function(errReturnUser, resultReturnUser) {
            if(errReturnUser) {
              return res.status(500).send("Fehler.");
            }
            return res.json(resultReturnUser);
          });
      }
    }
  });
}

exports.verifyProfile = function (req, res, next) {
  var code = req.body.code;
  var email = req.body.email;
  User.findOne({email:email, "invite.codes":code}, function(err, resultHost) {
    if(err) {return next(err);}
    if(!resultHost) {
      var err = new Error('Diese E-Mail oder dieser Code existiert nicht.');
      err.status = 400;
      return next(err);
    }
    User.findById(req.userId, function(errUser, resultNewUser) {
      if(errUser) {return next(errUser);}
      if(!resultNewUser) {
        var err = new Error('resultUser nicht gefunden. kann eig nicht sein');
        err.status = 400;
        return next(err);
      }
      resultNewUser.invite.level = resultHost.invite.level+1;
      if(resultHost.invite.level < 2) {
        for(var i = 0; i < 4; i++) {
          var codeToInsert = Math.floor(Math.random()*100000000000000000);
          if(resultNewUser.invite.codes.indexOf(codeToInsert) > -1) {
            i--;
          } else {
            resultNewUser.invite.codes.push(codeToInsert);
          }
        }
      }
      resultHost.invite.children.push(resultNewUser._id);
      resultHost.invite.codes.splice(resultHost.invite.codes.indexOf(code),1);
      resultHost.save();
      resultNewUser.save();
      res.send("ok");
    });
  });
};

// TODO: Profil muss gelöscht werden aus: Henquiries, Messages, Children bei Freunde werben
exports.deleteProfile = (req, res, next) => {
  var userId = req.userId;
  if(req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwörter sind nicht gleich.');
    err.status = 400;
    return next(err);
  }
  Henquiry.find({$or: [{createdBy: userId}, {potentialAide: userId}, {aide: userId}]}, function(errHenquiry, resultHenquiry) {
    if(errHenquiry) {return next(errHenquiry);}
    if(resultHenquiry) {
      for(var i = 0; i < resultHenquiry.length; i++) {
        if(resultHenquiry[i].createdBy == userId) {
          resultHenquiry[i].remove();
        } else if(resultHenquiry[i].potentialAide.indexOf(userId) > -1) {
          resultHenquiry[i].potentialAide.splice(resultHenquiry[i].potentialAide.indexOf(userId),1);
        } else if(resultHenquiry[i].aide.indexOf(userId) > -1) {
          resultHenquiry[i].aide.splice(resultHenquiry[i].aide.indexOf(userId),1);
        }
        resultHenquiry[i].save();
      }
    }
    Message.find({$or: [{filer: userId}, {aide: userId}]}, function(errMsg, resultMsg) {
      if(errMsg) {return next(errMsg);}
      if(resultMsg) {
        for(var i = 0; i < resultMsg.length; i++) {
          if(resultMsg[i].aide == userId) {
            resultMsg[i].messages.push({message: "Der Hilfsbedürftige hat seinen Account gelöscht.", participant: 4, timeSent: new Date()});
            resultMsg[i].readFiler = false;
          } else if(resultMsg[i].potentialAide == userId) {
            resultMsg[i].readAide = false;
            resultMsg[i].messages.push({message: "Der Helfer hat seinen Account gelöscht.", participant: 3, timeSent: new Date()});
          }
          resultMsg[i].readOnly = true;
          resultMsg[i].save();
        }
      }
      User.find({"invite.children": userId}, function(errUser, resultUser) {
        if(errUser) {return next(errUser);}
        if(resultUser) {
          for(var i = 0; i < resultUser.length; i++) {
            resultUser[i].invite.children.splice(resultUser[i].invite.children.indexOf(userId),1);
            resultUser[i].save();
          }
        }
        res.send("ok");
      });
    });
    User.deleteOne({_id: userId}, function(errDelete) {
      if(errDelete) {
        console.log("IN DELETEPROFILE BEI DELETEONE");
        console.log(errDelete);
        return res.json("Fehler.");
      }
    });
  });
};

exports.test = (req, res, next) => {

};

exports.test2 = (req, res, next) => {
    User.find({}, function(err, res) {
      console.log(res.length);
      res.send("ok");
    });
}