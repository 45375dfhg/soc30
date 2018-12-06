var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var Category = require('../models/category');
var mongoose = require('mongoose');
var logger = require('../logs/logger');

// Alle Hilfsgesuche laden, eigene Hilfsgesuche werden nicht geladen
exports.getHenquiries = (req, res, next) => {
    var categories;
    // Es wird nicht nach Kategorien gefiltert
    if(req.body.category === null || req.body.category === undefined) {
      categories = {};
    // Es wird nach Kategorien gefiltert
    } else {
      categories = JSON.parse(req.body.category);
      var category = categories.category;
      var subcategory = categories.subcategory;
    }
    if(!req.body.distance) {
      req.body.distance = 99999;
    }
    var conditionsForQuery;
    if(category === undefined && subcategory === undefined) {
      conditionsForQuery = {closed: false, happened: false, removed: false};
    } else if(category !== undefined && subcategory === undefined) {
      conditionsForQuery = {closed: false, happened: false, removed: false, "category.category": category};
    } else if(category !== undefined && subcategory !== undefined) {
      conditionsForQuery = {closed: false, happened: false, removed: false, "category.category": category,
      "category.subcategory":subcategory};
    } else {
      return res.status(400).send("AA_001");
    }
    Henquiry.find(conditionsForQuery)
    .select('amountAide startTime endTime text category potentialAide aide')
    // Koordinaten populaten, damit sie für die Entfernungsberechnung benutzt werden können.
    // Müssen vor dem Senden an den Client auf undefined gesetzt werden.
    .populate('createdBy', 'firstname surname nickname coordinates')
    .exec(function (err, list_henquiries) {
      if(err) {
        logger.log('error', new Date() + 'GET/henquiries, Code: AA_002, Error:' + err);
        return res.status(500).send("AA_002");
      }
      User.findById(req.userId, function(userErr, userResult) {
        if(userErr) {return next(userErr);}
        for(var i = 0; i < list_henquiries.length; i++) {
          // Der Nachname wird zensiert, nur den ersten Buchstaben schicken.
          list_henquiries[i].createdBy.surname = list_henquiries[i].createdBy.surname.charAt(0).toUpperCase();
          list_henquiries[i].distance = GPSdistance(list_henquiries[i].createdBy.coordinates.latitude,
            list_henquiries[i].createdBy.coordinates.longitude, 
            userResult.coordinates.latitude,
            userResult.coordinates.longitude);
          if(list_henquiries[i].distance > req.body.distance) {
            list_henquiries.splice(i,1);
            i--;
          }
        }
        // Eigene Henquiries und Henquiries, wo man sich beworben hat bzw. hilft werden nicht mitgeschickt
        // Die Koordinaten, aide und potentialAide werden wieder entfernt
        for(var i = 0; i < list_henquiries.length; i++) {
          if(list_henquiries[i].createdBy._id == req.userId
            || list_henquiries[i].aide.indexOf(req.userId) > -1 || list_henquiries[i].potentialAide.indexOf(req.userId) > -1
            ){
              list_henquiries.splice(i,1);
              i--;
          } else {
            list_henquiries[i].createdBy.coordinates = list_henquiries[i].aide = list_henquiries[i].potentialAide = undefined;
          }
        }
        return res.status(200).json(list_henquiries);
      });
    });
};

// TEST ROUTE FOR DEV. Holt alle Henquiries, auch wenn closed oder happened = true
exports.henquiry_test = (req, res, next) => {
    Henquiry.find({}, function(err, result) {
      if(err) {return next(err);}
      return res.json(result);
    });
};

exports.createHenquiry = (req, res, next) => {
    if(!(req.body.amountAide && req.body.startTime && req.body.endTime && req.body.category)) {
      return res.status(400).send("AB_001");
    }
    req.body.endTime = new Date(req.body.endTime);
    req.body.startTime = new Date(req.body.startTime);
    if(req.body.endTime - req.body.startTime == 1800000 || req.body.endTime - req.body.startTime == 3600000 ||
      req.body.endTime - req.body.startTime == 5400000 || req.body.endTime - req.body.startTime == 7200000 || 
      req.body.endTime - req.body.startTime == 9000000 || req.body.endTime - req.body.startTime == 10800000) {
    // Übergebenes JSON in ein JS-Objekt parsen
    var categoryParam = JSON.parse(req.body.category);
    Category.findOne({categoryId: categoryParam.category, "subcategory.categoryId": categoryParam.subcategory},
    function(errCategory, resultCategory) {
      if(errCategory) {
        logger.log('error', new Date() + 'POST/henquiries, Code: AB_002, Error:' + errCategory);
        return res.status(500).send("AB_002");
      }
      if(!resultCategory) {
        return res.status(400).send("AB_003");
      }
      var startTime = new Date(req.body.startTime);
      var endTime = new Date(req.body.endTime);

      if(!(startTime instanceof Date) || !(endTime instanceof Date)) {
        return res.status(400).send("AB_004");
      }
      if(req.body.startTime >= req.body.endTime) {
        return res.status(400).send("AB_005");
      }
      // Hilfsgesuch dauert länger als drei Stunden. Drei Stunden sind das Maximum.
      if(req.body.endTime - req.body.startTime > 10800000) {
        return res.status(400).send("AB_007");
      }

      var tempTime = new Date();
      tempTime.setHours(tempTime.getHours()+1);
      var henquiry = new Henquiry({
        amountAide: req.body.amountAide,
        createdBy: req.userId,
        creationTime: tempTime,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        category: {category: categoryParam.category, subcategory: categoryParam.subcategory},
        terra: Math.ceil((endTime-startTime)/1800000)
      });
      if(req.body.startTime <= henquiry.creationTime || req.body.endTime <= henquiry.creationTime) {
        return res.status(400).send("AB_006");
      }
      Henquiry.create(henquiry, function(error, result) {
        if(error) {
          logger.log('error', new Date() + 'POST/henquiries, Code: AB_009, Error:' + error);
          return res.status(500).send("AB_009");
        }
        return res.send("");
      });
    });
  } else {
    return res.status(400).send("AB_008");
  }
};

// Informationen über ein bestimmtes Henquiry laden.
// Unterschieden wird zwischen dem Ersteller und einem Bewerber/Helfer.
exports.getSpecificHenquiry = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId)
  .select({"closed":0, "removed":0, "happened":0})
  .populate('aide', 'firstname surname nickname')
  .populate('potentialAide', 'firstname surname nickname')
  .populate('createdBy', 'firstname surname nickname')
  .exec(function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'GET/henquiries/specific, Code: AC_001, Error:' + err);
      return res.status(500).send("AC_001");
    }
    if(!result) {
      return res.status(404).send("AC_002");
    }
    if(result.createdBy._id == req.userId) {
      return res.json(result);
    } else if(result.potentialAide.indexOf(req.userId) > -1 || result.aide.indexOf(req.userId) > -1) {
      result.aide = result.potentialAide = result.ratedAide = result.updated = undefined;
      return res.json(result);
    }
    for(var i = 0; i < result.potentialAide.length; i++) {
      if(result.potentialAide[i]._id == req.userId) {
        result.aide = result.potentialAide = result.ratedAide = result.updated = undefined;
        return res.json(result);
      }
    }
    for(var i = 0; i < result.aide.length; i++) {
      if(result.aide[i]._id == req.userId) {
        result.aide = result.potentialAide = result.ratedAide = result.updated = undefined;
        return res.json(result);
      }
    } 
    return res.status(403).send("AC_003");
  });
};

// TODO: Noch überlegen, was passiert, wenn die Hilfe stattfindet und 
// gelöscht wird (also Alternative zu erfolgreicher Hilfe?)
// TODO: Bei allen Usern am Tag des Henquiries count-- machen
exports.deleteHenquiry = (req, res, next) => {
    var henquiryId = req.body.henquiryId;
    var userId = req.userId; 
    Henquiry.findById(henquiryId, (err, result) => {
      if(err) {
        logger.log('error', new Date() + 'DELETE/henquiries/specific, Code: AD_001, Error:' + err);
        return res.status(500).send("AD_001");
      }
      if(!result) {
        return res.status(404).send("AD_002");
      }
      if(result.createdBy == userId) {
        if(!result.closed) {
          Message.find({henquiry: henquiryId}, function(errMsg, resultMsg) {
            if(errMsg) {
              logger.log('error', new Date() + 'DELETE/henquiries/specific, Code: AD_006, Error:' + errMsg);
              return res.status(500).send("AD_006");
            }
            for(var i = 0; i < resultMsg.length; i++) {
              resultMsg[i].readOnly = true;
              resultMsg[i].messages.push({message: "Der Helfer hat sein Henquiry gelöscht.", participant: 3, timeSent: new Date()});
              resultMsg[i].save();
            }
            result.delete();
            return res.send("AD_003");
          });
        } else {
          result.removed = true;
          result.save();
          return res.send("AD_005");
        }
      } else {
        return res.status(403).send("AD_004");
      }
    });
};

exports.apply = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = new mongoose.mongo.ObjectId(req.userId);
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'PUT/henquiries/apply, Code: AE_001, Error:' + err);
      return res.status(500).send("AE_001");
    } else {
      // Fehler, es werden keine weiteren Bewerber angenommen.
      if(result.closed || result.removed || result.happened) {
        return res.status(400).send("AE_002");
      }
      // Fehler, ein Nutzer kann sich nicht bei seinem eigenen Gesuch eintragen
      else if(result.createdBy == req.userId) {
        return res.status(400).send("AE_003");
      }
      else if(result.potentialAide.indexOf(userId) > -1) {
        // Fehler, man hat sich bereits beworben
        return res.status(400).send("AE_004");
      }
      else if(result.aide.indexOf(userId) > -1) {
        // Fehler, man wurde bereits als Helfer angenommen
        return res.status(400).send("AE_005");
      }
      // Prüfung, ob man bereits am selben Tag 5x hilft. Wenn ja, Fehler.
      User.findById(userId, function(errUser, resultUser) {
        if(errUser) {
          logger.log('error', new Date() + 'PUT/henquiries/apply, Code: AE_006, Error:' + errUser);
          return res.status(500).send("AE_006");
        }
        var dateOfHenquiry = result.startTime.getFullYear()+ "-" + (result.startTime.getMonth()+1)
        + "-" + result.startTime.getDate();
        var idx = 0;
        var dateFound = false;
        while(idx < resultUser.meetings.length && !dateFound) {
          if(resultUser.meetings[idx]["date"] === dateOfHenquiry) {
            dateFound = true;
            if(resultUser.meetings[idx]["count"] < 5) {
              resultUser.meetings[idx]["count"]++;
            } else {
              return res.status(400).send("AE_007");
            }
          }
          idx++;
        }
        var messageData = {
          aide: userId,
          filer: result.createdBy,
          henquiry: henquiryId,
          messages: {message: "Herzlichen Glückwunsch. Du hast dich beworben!", participant: 3, timeSent: new Date()}
        };
        Message.create(messageData, function(msgErr, msgResult) {
          if(msgErr) {
            logger.log('error', new Date() + 'PUT/henquiries/apply, Code: AE_008, Error:' + msgErr);
            return res.status(500).send("AE_008");
          }
          msgResult.messages.push({message: "Du hast einen Bewerber!", participant: 4, timeSent: new Date()});
          msgResult.save();
          if(!dateFound) {
            resultUser.meetings.push({date: dateOfHenquiry, count: 1});
          }
          resultUser.save();
          result.potentialAide.push(userId);
          result.updated = true;
          result.save();
          return res.send("");
        });
      });
    }
  });
};

// TODO: was passiert, wenn ein User 10 Bewerbungen hat und bei 5 angenommen wird
// Er darf ja nicht 10x helfen, also müsste er bei den anderen 5 verschwinden
exports.acceptApplicants = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var applicants = req.body.applicants;
  if(!applicants) {
    return res.status(400).send("AF_001");
  }
  // Da durch applicants iteriert wird, muss es auch bei einem einzigen übergebenen
  // Aide ein Array sein (bei > 1 aider ist es automatisch ein Array)
  if(!(applicants instanceof Array)) {
    applicants = new Array(applicants);
  }
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'PUT/henquiries/accept, Code: AF_002, Error:' + err);
      return res.status(500).send("AF_002");
    }
    if(!result) {
      return res.status(404).send("AF_003");
    }
    if(!(req.userId == result.createdBy)) {
      return res.status(403).send("AF_004");
    }
    if(result.removed || result.closed || result.happened) {
      return res.status(400).send("AF_005");
    } 
    // In dieser Schleife wird geprüft, ob ein Benutzer bereits als Helfer
    // eingetragen ist bzw. nicht als Bewerber eingetragen ist.
    for(var i = 0; i < applicants.length; i++) {
      if(result.aide.indexOf(applicants[i]) > -1) {
        return res.status(400).send("AF_006");
      }
      if(result.potentialAide.indexOf(applicants[i]) == -1) {
        return res.status(400).send("AF_007");
      }
    }
    for(var i = 0; i < applicants.length; i++) {
      /*messageData = {
        aide: applicants[i],
        filer: result.createdBy,
        henquiry: henquiryId,
        messages: {message: "Herzlichen Glückwunsch. Du wurdest als Helfer ausgewählt.", participant: 3, timeSent: new Date()}
      };
      Message.create(messageData, function(msgErr, msgResult) {
        if(msgErr) {
          logger.log('error', new Date() + 'PUT/henquiries/accept, Code: AF_008, Error:' + msgErr);
          return res.status(500).send("AF_008");
        }
        msgResult.messages.push({message: "Schön, dass du dir diesen Helfer ausgesucht hast.", participant: 4, timeSent: new Date()});
        msgResult.save();
      });*/
      result.potentialAide.splice(result.potentialAide.indexOf(applicants[i]),1);
      result.aide.push(applicants[i]);
    }
    result.save(); // Kann man nach jedem mal saven oder erst am ende?
    return res.status(200).send("");
  });
};

// Hilfsgesuche für neue Bewerber schließen. Henquiry wird nicht mehr in der Suche angezeigt werden.
exports.closeHenquiry = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) { 
      logger.log('error', new Date() + 'PUT/henquiries/close, Code: AG_001, Error:' + err);
      return res.status(500).send("AG_001");
    }
    if(!result) {
      return res.status(404).send("AG_002");
    }
    if(!(req.userId == result.createdBy)) {
      return res.status(403).send("AG_003");
    }
    if(result.closed || result.happened || result.removed) {
      return res.status(400).send("AG_004");
    }
    if(result.aide.length < 1) {
      return res.status(400).send("AG_005");
    }
    result.closed = true;
    result.save();
    res.send("");
  });
};

// TODO: Terra gutschreiben
exports.henquirySuccess = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'PUT/henquiries/success, Code: AH_001, Error:' + err);
      return res.status(500).send("AH_001");
    }
    if(!result) {
      return res.status(404).send("AH_002");
    }
    if(!result.closed || result.removed || result.happened) {
      return res.status(400).send("AH_003");
    }
    if(!(result.createdBy == req.userId)) {
      return res.status(403).send("AH_004");
    }
    result.happened = true;
    result.save();
    // Alle Chats auf readOnly = true setzen, sodass nicht mehr gechattet werden kann
    Message.find({henquiry: henquiryId}, function(errMsg, resultMsg) {
      if(errMsg) {
        logger.log('error', new Date() + 'PUT/henquiries/success, Code: AH_005, Error:' + errMsg);
        return res.status(500).send("AH_005");
      }
      if(!resultMsg) {
        return res.status(404).send("AH_006");
      }
      for(var i = 0; i < resultMsg.length; i++) {
        resultMsg[i].readOnly = true;
        resultMsg[i].save();
      }
      return res.send("");
    });
  });
};

exports.cancelApplication = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = new mongoose.mongo.ObjectId(req.userId);
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'PUT/henquiries/cancel, Code: AI_001, Error:' + err);
      return res.status(500).send("AI_001");
    }
    if(!result) {
      return res.status(404).send("AI_002");
    }
    if(result.happened || result.removed || result.closed) {
      return res.status(400).send("AI_003");
    }
    // Der Helfer ist als Bewerber eingetragen
    if(result.potentialAide.indexOf(userId) > -1) {
      result.potentialAide.splice(result.potentialAide.indexOf(userId),1);
    } else if(result.aide.indexOf(userId) > -1) {
      result.aide.splice(result.aide.indexOf(userId),1);
    } else {
      return res.status(400).send("AI_004");
    }
    // Nachrichtenverlauf schließen
    Message.findOne({henquiry: henquiryId}, function(errMsg, resultMsg) {
      if(errMsg) {
        logger.log('error', new Date() + 'PUT/henquiries/cancel, Code: AI_005, Error:' + errMsg);
        return res.status(500).send("AI_005");
      }
      resultMsg.readOnly = true;
      resultMsg.messages.push({message: "Der Helfer hat seine Hilfe/Bewerbung zurückgezogen.", participant: 3, timeSent: new Date()});
    // Ereignisse des Helfers an diesem Tag um 1 reduzieren
    User.findById(req.userId, function(errUser, resultUser) {
      if(errUser) {
        logger.log('error', new Date() + 'PUT/henquiries/cancel, Code: AI_006, Error:' + errUser);
        return res.status(500).send("AI_006");
      }
      if(!resultUser) {
        return res.status(404).send("AI_007");
      }
      var dateOfHenquiry = result.startTime.getFullYear()+ "-" + (result.startTime.getMonth()+1)
      + "-" + result.startTime.getDate();
      var idx = 0;
      var dateFound = false;
      while(idx < resultUser.meetings.length && !dateFound) {
        if(resultUser.meetings[idx]["date"] === dateOfHenquiry) {
          dateFound = true;
          resultUser.meetings[idx]["count"]--;
          if(resultUser.meetings[idx]["count"] == 0) {
            resultUser.meetings.splice(resultUser.meetings[idx],1);
          }
        }
        idx++;
      }
      resultUser.save();
      resultMsg.save();
      result.save();
      return res.status(200).send();
    });
    });
  });
};

// TODO: Distanz berechnen
exports.calendar = (req, res, next) => {
  var userId = req.userId;
  Henquiry.find({
    $and: [
      {$or: [{createdBy: userId}, {potentialAide: userId}, {aide: userId}]},
      {happened: false, removed: false}
    ]
  }).select('')
  .populate('aide','firstname surname nickname')
  .populate('createdBy', 'firstname surname nickname address')
  .exec(function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'GET/calendar, Code: AJ_001, Error:' + err);
      return res.status(500).send("AJ_001");
    }
    for(var i = 0; i < result.length; i++) {
      result[i].closed = result[i].removed = result[i].happened = undefined;
      if(!(userId == result[i].createdBy._id)) {
        result[i].aide = result[i].ratedAide = result[i].potentialAide = result.updated = undefined;
      }
    }
    return res.json(result);
  });
};

// TODO: Prüfen, ob es diese Bewertung überhaupt gibt
// TODO: Gegenrichtung gar nicht vorhanden !!! Den Hilfsbedürftigen bewerten
exports.rate = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = req.userId;
  var aider = req.body.aide;
  if(!(aider instanceof Array)) {
    aider = new Array(aider);
  }
  for(var i = 0; i < aider.length; i++) {
    aider[i] = JSON.parse(aider[i]);
  }
  Henquiry.findById(henquiryId, function(errHenquiry, resultHenquiry) {
    if(errHenquiry) {return next(errHenquiry);}
    if(!(userId == resultHenquiry.createdBy)) {
      errHenquiry = new Error('Das ist nicht dein Hilfegesuch.');
      errHenquiry.status = 400;
      return next(errHenquiry);
    }
    if(!result.happened || !result.closed || result.removed) {
      err = new Error('Ungültige Anfrage.');
      err.status = 400;
      return next(err);
    }
    if(result.aide.length == 0) {
      err = new Error('Es wurden bereits alle Helfer bewertet.');
      err.status = 400;
      return next(err);
    }
    
    // Prüfen, ob der Helfer überhaupt Helfer war
    for(var i = 0; i < aider.length; i++) {
      if(resultHenquiry.aide.indexOf(aider[i].aideId) == -1) {
        return res.json("Mindestens eine Person ist nicht als Helfer eingetragen.");
      }
    }

    /*
    @aiderIndex: Index zum Durchlaufen aller Helfer, die übergeben wurden.
    @ratingIndex: Index zum Durchlaufen aller Bewertungen, die ein Helfer bekommen hat
    Es wird nicht i zum Zugriff benutzt, sondern aiderIndex, da ein Callback in der
    Schleife ist, was zur Folge hat, dass i zu schnell erhöht wird...
    */
    var aiderIndex = 0;
    for(var i = 0; i < aider.length; i++) {
        User.findById(aider[i].aideId, function(userErr, userResult) {
          if(userErr) {return next(userErr);}
          for(var ratingIndex = 0; ratingIndex < aider[aiderIndex].ratings.length; ratingIndex++) {
            if(userResult.ratings[aider[aiderIndex].ratings[ratingIndex]] === undefined) {
              userResult.ratings.set(aider[aiderIndex].ratings[ratingIndex],1);
            } else {
              userResult.ratings.set(aider[aiderIndex].ratings[ratingIndex],userResult.ratings[aider[aiderIndex].ratings[ratingIndex]]+1);
            }
          }
          userResult.terra += resultHenquiry.terra;
          userResult.save();
          resultHenquiry.ratedAide.push(aider[aiderIndex].aideId);
          resultHenquiry.aide.splice(resultHenquiry.aide.indexOf(aider[aiderIndex].aideId),1);
          resultHenquiry.save();
          aiderIndex++;
      });
    }
    return res.send("ok");
  });
};

// From stackoverflow:
// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function GPSdistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

// Funktion, die in einem gewissen Zeitabstand prüft, ob es Henquiries gibt,
// deren Startzeitpunkt in der Vergangenheit liegt. Diese werden dann closed,
// wenn Helfer vorhanden sind, ansonsten removed mit einer Nachricht an den Filer.
// TODO: In eine eigene Funktion auslagern.
setInterval(() => {
  Henquiry.find({closed: false, happened: false, removed: false}, function(err, result) {
    if(err) {
      logger.log('error', new Date() + 'Error:' + err);
      return;
    }
    for(var i = 0; i < result.length; i++) {
      if(result[i].startTime < new Date()) {
        if(result[i].aide.length == 0) {
          result[i].removed = true;
          result[i].save();
        } else {
          result[i].closed = true;
          result[i].save();
        }
      }
    }
  });
},60000);