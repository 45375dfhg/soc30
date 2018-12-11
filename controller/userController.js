var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var bcrypt = require('bcryptjs');
var logger = require('../logs/logger');

// From stackoverflow: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// TODO: Für die Abschlusspräsentation automatisch Koordinaten zuweisen im Raum Stuttgart
// Oben links: 48.829204, 9.084249
// Oben rechts: 48.832318, 9.254367
// Unten rechts: 48.721896, 9.257321
// Unten links: 48.720748, 9.073483
// Latitude [9.073483, 9.257321], Longitude [48.720748, 48.832318]
exports.register = function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    return res.status(400).send("CC_001");
  }
  if (req.body.email && req.body.password && req.body.passwordConf && 
    req.body.surname && req.body.firstname && req.body.nickname && req.body.postalcode
    && req.body.street && req.body.housenm && req.body.city) {
    var address = {postalcode: req.body.postalcode, street: req.body.street, housenm: req.body.housenm,
    city: req.body.city};
    if(!address.postalcode || !address.street || !address.housenm || !address.city) {
      return res.status(400).send("CC_004");
    }
    req.body.email = req.body.email.toLowerCase();
    if(!validateEmail(req.body.email)) {
      return res.status(400).send("CC_005");
    }
    address.postalcode = parseInt(address.postalcode);
    User.findOne({email:req.body.email}, function(errEmail, resultEmail) {
      if(errEmail) {
        logger.log('error', new Date() + 'POST/register, Code: CC_001, Error:' + errEmail);
        return res.status(500).send("CC_001");
      }
      if(!resultEmail) {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        var latitude = (Math.random()*(9.257321 - 9.073483)+9.073483).toFixed(6);
        var longitude = (Math.random()*(48.832318 - 48.720748)+48.720748).toFixed(6);
        // Populate ratings array with 3 random ratings so that profile is not empty at the beginning
        var ratings = [0,0,0,0,0,0,0,0,0,0,0,0];
        var count = 0;
        var idx = 0;
        while(count != 3) {
          idx = Math.floor(Math.random()*12);
          if(ratings[idx] == 0) {
            count++;
            ratings[idx] = 1;
          }
        }
        var userData = {
          email: req.body.email,
          password: hashedPassword,
          surname: req.body.surname,
          firstname: req.body.firstname,
          nickname: req.body.nickname,
          address: address,
          registerDate: new Date(),
          coordinates: {latitude: latitude, longitude:longitude},
          invite: {level:3, codes:[], children:[]},
          ratings: ratings
        }
        User.create(userData, function (error, user) {
          if (error) {
            logger.log('error', new Date() + 'POST/register, Code: CC_002, Error:' + error);
            return res.status(500).send("CC_002");
          }
          // create a token
          var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400*31 // expires in 31 days
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
      expiresIn: 86400*31 // expires in 31 days
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
      projection = 'nickname firstname surname ratings avatar registerDate';
    } else {
      projection = 'surname firstname email nickname ratings address invite mobile avatar terra registerDate';
    }
    User.findById(req.body.userId, projection)
      .exec(function (error, user) {
        if (error) {
          logger.log('error', new Date() + 'GET/profile, Code: CA_001, Error:' + error);
          return res.status(500).send("CA_001");
        } else {
          if (!user) {
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
  if(req.body.surname) {data.surname = req.body.surname;}
  if(req.body.firstname) {data.firstname = req.body.firstname;}
  if(req.body.nickname) {data.nickname = req.body.nickname;}
  if(req.body.mobile) {data.mobile = req.body.mobile;}
  if(req.body.avatar && req.body.avatar >= 0 && req.body.avatar < 6) {data.avatar = req.body.avatar;}
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
          var codeToInsert = Math.floor(Math.random()*100000);
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