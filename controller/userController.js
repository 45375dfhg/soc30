// For authentication
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var logger = require('../logs/logger');


const {check, validationResult} = require('express-validator/check');

exports.validate = (method) => {
  switch(method) {
    case 'register': {
      return [
        check('email').exists().isEmail(),
      ]
    }
  }
}

// TODO: Man muss ne Adresse mitgeben
// TODO: Für die Abschlusspräsentation automatisch Koordinaten zuweisen im Raum Stuttgart
// TODO: expiresIn deutlich erhöhen
exports.register = function (req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).send("CC_005");
  }
  if (req.body.password !== req.body.passwordConf) {
    return res.status(400).send("CC_001");
  }

  if (req.body.email &&
    req.body.password &&
    req.body.passwordConf && req.body.surname && req.body.firstname && req.body.nickname) {
    req.body.email = req.body.email.toLowerCase();
    User.findOne({email:req.body.email}, function(errEmail, resultEmail) {
      if(errEmail) {
        logger.log('error', new Date() + 'POST/register, Code: CC_001, Error:' + errEmail);
        return res.status(500).send("CC_001");
      }
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
          if (error) {
            logger.log('error', new Date() + 'POST/register, Code: CC_002, Error:' + error);
            return res.status(500).send("CC_002");
          }
          // create a token
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          return res.status(200).send({ auth: true, token: token , _id: user._id});
        });
      } else {
        return res.status(400).send("CC_003");
      }
  });
  } else {
    return res.status(400).send("CC_004");
  }
};

// TODO: expiresIn deutlich erhöhen
exports.login = function (req, res, next) {
if (req.body.logemail && req.body.logpassword) {
  User.findOne({ email: req.body.logemail }, function (err, user) {
    if (err) {
      logger.log('error', new Date() + 'POST/login, Code: CD_001, Error:' + err);
      return res.status(500).send("CD_001");
    }
    if (!user) {
      return res.status(404).send("CD_002");
    }
    var passwordIsValid = bcrypt.compareSync(req.body.logpassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    return res.status(200).send({ auth: true, token: token, _id: user._id });
  });
    } else {
      logger.log('error', new Date() + 'POST/login, Code: CD_003, Error:' + err);
      return res.status(400).send("CD_003");
    }
};

exports.logout = function (req, res, next) {
      return res.status(200).send({ auth: false, token: null });
};

exports.getProfile = function (req, res, next) { 
    var projection;
    if(!(req.body.userId === req.userId)) {
      projection = 'nickname firstname surname ratings avatar';
    } else {
      projection = 'surname firstname email nickname ratings address invite mobile avatar terra';
    }
    User.findById(req.body.userId, projection)
      .exec(function (error, user) {
        if (error) {
          logger.log('error', new Date() + 'GET/profile, Code: CA_001, Error:' + error);
          return res.status(500).send("CA_001");
        } else {
          if (!user) {
            logger.log('error', new Date() + 'GET/profile, Code: CA_002, Error:' + err);
            return res.status(404).send("CA_002");
          } else {
            if(!(req.body.userId === req.userId)) {
              user.surname = user.surname.charAt(0).toUpperCase();
            }
            return res.json(user);
          }
        }
      });
};

// TODO: Übergebene Daten validieren (E-Mail, Avatar [0-5], Handynummer)
exports.editProfile = function (req, res, next) {
  var data = {};
  data.address = {};
  if(req.body.password) {
    User.findById(req.userId, function(errPWCheck, resultPWCheck) {
      if(errPWCheck) {
        logger.log('error', new Date() + 'PUT/profile/specific, Code: CB_002, Error:' + errPWCheck);
        return res.status(500).send("CB_002");
      }
      if(!resultPWCheck) {
        return res.status(404).send("CB_003");
      }
      var passwordIsValid = bcrypt.compareSync(req.body.password, resultPWCheck.password);
      if (!passwordIsValid) {
        return res.status(401).send("CB_004");
      }
      if(req.body.passwordNew && req.body.passwordNewConf) {
        if(req.body.passwordNew === req.body.passwordNewConf) {
          data.password = bcrypt.hashSync(req.body.passwordNew, 8);
        } else {
          return res.status(400).send("CB_005");
        }
      }
      populateDataToBeUpdated(req, data, res);
    });
  } else {
    return res.status(400).send("CB_001");
  }
};

function populateDataToBeUpdated(req, data, res) {
  if(req.body.email) {data.email = req.body.email;}
  if(req.body.surname) {data.surname = req.body.surname;}
  if(req.body.firstname) {data.firstname = req.body.firstname;}
  if(req.body.nickname) {data.nickname = req.body.nickname;}
  if(req.body.mobile) {data.mobile = req.body.mobile;}
  if(req.body.avatar) {data.avatar = req.body.avatar;}
  if(req.body.address) {
    User.findById(req.userId, function(err, result) {
      if(err) {
        logger.log('error', new Date() + 'PUT/profile/specific, Code: CB_006, Error:' + err);
        return res.status(500).send("CB_006");
      }
      var address = JSON.parse(req.body.address);
      data.address = result.address;
      if(address.postalcode) {data.address.postalcode = address.postalcode;}
      if(address.street) {data.address.street = address.street;}
      if(address.city) {data.address.city = address.city;}
      if(address.housenm) {data.address.housenm = address.housenm;}
      updateUser(req, data, res);
    });
  } else {
    updateUser(req, data, res);
  }
}

function updateUser(req, data, res) {
  User.findByIdAndUpdate(req.userId, {$set : data}, function (error, user) {
    if(error) {
      logger.log('error', new Date() + 'PUT/profile/specific, Code: CB_007, Error:' + error);
      return res.status(500).send("CB_007");
    } 
    if (user === null) {
      return res.status(404).send("CB_008");
    } else {
        User.findById(req.userId, function(errReturnUser, resultReturnUser) {
          if(errReturnUser) {
            logger.log('error', new Date() + 'PUT/profile/specific, Code: CB_000, Error:' + errReturnUser);
            return res.status(500).send("CB_009");
          }
          resultReturnUser.password = undefined;
          return res.json(resultReturnUser);
        });
    }
    
  });
}

// TODO: Falls noch Zeit ist, Codes einzigartig machen und auf E-Mail des
// Werbenden verzichten
exports.verifyProfile = function (req, res, next) {
  var code = req.body.code;
  var email = req.body.email;
  User.findOne({email:email, "invite.codes":code}, function(err, resultHost) {
    if(err) {
      logger.log('error', new Date() + 'PUT/profile/verify, Code: CF_001, Error:' + err);
      return res.status(500).send("CF_001");
    }
    if(!resultHost) {
      return res.status(404).send("CF_002");
    }
    User.findById(req.userId, function(errUser, resultNewUser) {
      if(errUser) {
        logger.log('error', new Date() + 'PUT/profile/verify, Code: CF_003, Error:' + errUser);
        return res.status(500).send("CF_003");
      }
      if(!resultNewUser) {
        return res.status(404).send("CF_004");
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
      res.send("");
    });
  });
};

exports.deleteProfile = (req, res, next) => {
  var userId = req.userId;
  User.findById(userId, function(errPWCheck, resultPWCheck) {
    if(errPWCheck) {
      logger.log('error', new Date() + 'DELETE/profile/specific, Code: CE_006, Error:' + errPWCheck);
      return res.status(500).send("CE_006");
    }
    if(!resultPWCheck) {
      return res.status(404).send("CE_007");
    }
    var passwordIsValid = bcrypt.compareSync(req.body.password, resultPWCheck.password);
    if (!passwordIsValid) {
      return res.status(401).send("CE_001");
    }
    Henquiry.find({$or: [{createdBy: userId}, {potentialAide: userId}, {aide: userId}]}, function(errHenquiry, resultHenquiry) {
      if(errHenquiry) {
        logger.log('error', new Date() + 'DELETE/profile/specific, Code: CE_002, Error:' + errHenquiry);
        return res.status(500).send("CE_002");
      }
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
        if(errMsg) {
          logger.log('error', new Date() + 'DELETE/profile/specific, Code: CE_003, Error:' + errMsg);
          return res.status(500).send("CE_003");
        }
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
          if(errUser) {
            logger.log('error', new Date() + 'DELETE/profile/specific, Code: CE_004, Error:' + errUser);
            return res.status(500).send("CE_004");
          }
          if(resultUser) {
            for(var i = 0; i < resultUser.length; i++) {
              resultUser[i].invite.children.splice(resultUser[i].invite.children.indexOf(userId),1);
              resultUser[i].save();
            }
          }
          User.deleteOne({_id: userId}, function(errDelete) {
            if(errDelete) {
              logger.log('error', new Date() + 'DELETE/profile/specific, Code: CE_005, Error:' + errDelete);
              return res.status(500).send("CE_005");
            }
            return res.send("");
          });
        });
      });
    });
  });
};

exports.test = (req, res, next) => {
  User.findById(req.userId, (err, result) => {
    if(err) {
      return console.log(err);
    }
    console.log(result.meetings[0]["date"]);
    result.meetings[0]["count"]++;
    //var temp = result.meetings;
    //console.log(temp["2018-12-15"]);
    /*console.log(temp);
    console.log(temp["2018-12-15"]);
    console.log(++result.meetings["2018-12-15"]);
    ++result.meetings["2018-12-15"];
    console.log(temp);*/
    //console.log(result.meetings["2018-12-16"]);
    //temp["2018-12-17"];
    //result.meetings = JSON.stringify(temp);
    //result.meetings = {"c": 1};
    //result.meetings["d"] = 4;
    //console.log(typeof result.meetings["2018-12-16"]);
    result.save();
    //console.log(result);
    return res.send(result);
  });
};