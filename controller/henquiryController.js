var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var path = require('path');
var mongoose = require('mongoose');

// Fetch all henquiries
// @param: postalcode
exports.henquiries_get = (req, res, next) => {
    //Henquiry.find({postalcode: req.body.postalcode})
    Henquiry.find({confirmation: false})
    .select('amountAide startTime endTime text postalcode subcategoryId')
    .populate('createdBy', 'email nickname')
    .exec(function (err, list_henquiries) {
      if(err) {
        console.log("Im error");
        return next(err);
      }
      res.status(200);
      return res.json(list_henquiries);
    });
    //return res.sendFile(path.join(path.dirname(__dirname) + '/public/noindex.html'));
};

// TODO: Subcategory fehlt
// TODO: Henquiries, deren startTime überschritten ist und die nicht angenommen wurden, verfallen.
// => die Hilfe findet nicht statt und sie verschwinden aus der Liste
// @param: text, postalcode, amountAide (, subcategory, startTime, endTime)
exports.henquiries_create = (req, res, next) => {
    if(!(req.body.text && req.body.amountAide && req.body.postalcode)) {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
    /*
    if(req.body.startTime >= req.body.endTime) {
      var err = new Error('Die Startzeit kann nicht nach der Endzeit liegen.');
      err.status = 400;
      return next(err);
    }
    if(req.body.startTime <= req.creationTime || req.body.end <= req.creationTime) {
      var err = new Error('Die Start- oder Endzeit liegt in der Vergangenheit.');
      err.status = 400;
      return next(err);
    }
    */
    var henquiry = new Henquiry({
      text: req.body.text,
      amountAide: req.body.amountAide,
      postalcode: req.body.postalcode,
      createdBy: req.session.userId,
      creationTime: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      confirmation: "false"
    });
    Henquiry.create(henquiry, function(error, result) {
      if(error) {
        return next(error);
      }
      res.json(result);
    });
    /*User.find({}, function(err, result) {
      henquiry.save(function (err) {
        if (err) {return next(err);}
        res.status(200).send(result);
      });
    });*/
};

exports.henquiries_specific_get = (req, res, next) => {
  // Fetch information about a specific query, such as potential aiders and aiders
  // TODO Must only be available for the owner of the henquiry
  var henquiryId = req.query.henquiryId;
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      return next(err);
    }
    if(!result) {
      return res.status(404).send("Dieses Hilfsgesuch existiert nicht.");
    }
    if(result.createdBy == req.session.userId) {
      return res.json(result);
    } else {
      return res.status(403).send("Das ist nicht dein Hilfegesuch.");
    }  
  });
};

// TODO: Benachrichtung schicken
exports.henquiries_delete = (req, res, next) => {
    var henquiryId = req.body.henquiryId;
    var userId = req.session.userId;
    Henquiry.findById(henquiryId, (err, result) => {
      if(err) {
        return next(err);
      }
      if(!result) {
        return res.status(404).send("Das Hilfegesuch existiert nicht.");
      }
      if(result.createdBy == userId) {

        result.delete();
        return res.send("deleted");
      } else {
        return res.status(403).send("Das ist nicht dein Hilfegesuch.");
      }
    });
};

exports.henquiry_confirm = (req, res, next) => {
  var userId = req.session.userId;
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId, function(error, result) {
    if(!(req.session.userId == result.createdBy)) {
      err = new Error('Das ist nicht dein Hilfegesuch digga.');
      err.status = 403;
      return next(err);
    }
    result.confirmation = true;
    result.save();
  });
  res.send("ok");
};

// TODO: Fehlerbehandlung richtig machen
exports.apply_post = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = new mongoose.mongo.ObjectId(req.session.userId);
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      return res.send(err); 
    } else {
      var error;
      // Fehler, es werden keine weiteren Bewerber angenommen.
      if(result.confirmation) {
      }
      // Fehler, ein Nutzer kann sich nicht bei seinem eigenen Gesuch eintragen
      else if(result.createdBy == req.session.userId) {
        console.log("apply_post :: eigenes Gesuch");
        error = new Error('Du kannst dich nicht bei deinem eigenen Hilfegesuch eintragen.');
        error.status = 402;
      }
      else if(result.potentialAide.indexOf(userId) > -1) {
        // Fehler, man hat sich bereits beworben
        console.log("apply_post :: ist in potentialAide");
        error = new Error('Du hast dich bereits beworben.');
        error.status = 400;
      }
      else if(result.aide.indexOf(userId) > -1) {
        error = new Error('Du bist bereits Helfer.');
        error.status = 401;
        // Fehler, man wurde bereits als Helfer angenommen
      }
      if(error) {
        return next(error);
      }
      console.log("apply_post :: nach den Fehlern");
      result.potentialAide.push(userId);
      result.save();
      res.json(result);
    }
  });
};

// TODO: Benutzer benachrichtigen, dass er angenommen wurde
exports.confirmation_post = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  console.log("oben:" + typeof henquiryId)
  var applicants = req.body.applicants;
  var messageData;
  Henquiry.findById(henquiryId, function(err, result) {
    if(!result) {
      return next(new Error('Das Hilfsgesuch existiert nicht.'));
    } else if(!(req.session.userId == result.createdBy)) {
      return next(new Error('Das ist nicht dein eigenes Gesuch.'));
    } else if(!applicants) {
      return next(new Error('Es wurden keine Helfer übergeben.'));
    }
    for(var i = 0; i < applicants.length-1; i++) {
      if(result.aide.indexOf(applicants[i]) > -1) {
        // TODO: Nicht direkt den Fehler werfen, sondern erst, nachdem versucht wurde, alle einzufügen
        return next(new Error('Der Helfer ist bereits im aide Array.'))
      }
      messageData = {
        aide: applicants[i],
        filer: result.createdBy,
        henquiry: henquiryId,
        message: {message: "moin, i bims", participant: 3}
      };
      var aideId = applicants[i]
      Message.create(messageData, function(msgErr, msgResult) {
        if(msgErr) {
          return next(msgErr);
        }
        User.findById(aideId, function(userErr, userResult) {
          if(userErr) {
            return next(userErr);
          }
          if(!userResult) {
            console.log("Nix gefunden");
          }
          console.log(userResult)
          userResult.messages.push(msgResult._id);
          userResult.save();

        });
        User.findById(result.createdBy, function(userErr, userResult) {
          if(userErr) {
            return next(userErr);
          }
          if(!userResult) {
            console.log("Nix gefunden");
          }
          console.log(userResult)
          userResult.messages.push(msgResult._id);
          userResult.save();
        });
      });
      result.potentialAide.splice(result.potentialAide.indexOf(applicants[i]),1);
      result.aide.push(applicants[i]);
      result.save(); // Kann man nach jedem mal saven oder erst am ende?
    }
    res.send('ok');
  });
};

// TODO: Benachrichtigung an den Filer, falls der Aide im aide-Array war
exports.cancel_post = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  // TODO: Statt req.body.userId muss hier req.session.userId hin, damit man nur
  // sich selbst aus einem Hilfegesuch austragen kann
  var userId = new mongoose.mongo.ObjectId(req.body.userId);
  var result = "{a: 1, b:2}";
  Henquiry.findById(henquiryId, function(err, result) {
    if(!result) {
      return next(new Error('Das Hilfsgesuch existiert nicht.'));
    }
    if(result.potentialAide.indexOf(userId) > -1) {
      result.potentialAide.splice(result.potentialAide.indexOf(userId),1);
    } else if(result.aide.indexOf(userId) > -1) {
      result.aide.splice(result.aide.indexOf(userId),1);
    } else {
      return next(new Error('Du bist nicht in diesem Hilfegesuch eingetragen.'));
    }
    result.save();
  });
  res.json(result);
};

exports.calendar = (req, res, next) => {
  var userId = req.session.userId;
  Henquiry.find({$or: [{createdBy: userId}, {potentialAide: userId}, {aide: userId}]}, function(err, result) {
    if(err) {
      return next(err);
    }
    res.json(result);
  });
};