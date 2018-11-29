var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var Message = require('../models/message');
var Category = require('../models/category');
var Rating = require('../models/rating');
var mongoose = require('mongoose');

// Fetch all henquiries
// TODO: Eigene Hilfsgesuche nicht anzeigen?
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
    var conditions;
    if(category === undefined && subcategory === undefined) {
      conditions = {closed: false, happened: false, removed: false};
    } else if(category !== undefined && subcategory === undefined) {
      conditions = {closed: false, happened: false, removed: false, "category.category": category};
    } else if(category !== undefined && subcategory !== undefined) {
      conditions = {closed: false, happened: false, removed: false, "category.category": category,
      "category.subcategory":subcategory};
    } else {
      var err = new Error('Es wurde keine Oberkategorie angegeben.');
      err.status = 400;
      return next(err);
    }
    Henquiry.find(conditions)
    .select('amountAide startTime endTime text category')
    // Koordinaten populaten, damit sie für die Entfernungsberechnung benutzt werden können.
    // Müssen vor dem Senden an den Client auf undefined gesetzt werden.
    .populate('createdBy', 'firstname surname nickname coordinates')
    .exec(function (err, list_henquiries) {
      if(err) {
        console.log("Im error");
        return next(err);
      }
      console.log(list_henquiries);
      User.findById(req.userId, function(userErr, userResult) {
        if(userErr) {return next(userErr);}
        for(var i = 0; i < list_henquiries.length; i++) {
          list_henquiries[i].distance = GPSdistance(list_henquiries[i].createdBy.coordinates.latitude,
            list_henquiries[i].createdBy.coordinates.longitude, 
            userResult.coordinates.latitude,
            userResult.coordinates.longitude);
          if(list_henquiries[i].distance > 99999 ) {
            list_henquiries.splice(i,1);
            i--;
          }
        }
        for(var i = 0; i < list_henquiries.length; i++) {
          list_henquiries[i].createdBy.coordinates = undefined;
        }
        res.status(200);
        return res.json(list_henquiries);
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

// TODO: Autogenerierten Text erstellen
exports.createHenquiry = (req, res, next) => {
    if(!(req.body.amountAide && req.body.startTime && req.body.endTime && req.body.category)) {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
    // Übergebenes JSON in ein JS-Objekt parsen
    var categoryParam = JSON.parse(req.body.category);
    Category.findOne({categoryId: categoryParam.category, "subcategory.categoryId": categoryParam.subcategory},
    function(errCategory, resultCategory) {
      if(errCategory) {return next(errCategory);}
      if(!resultCategory) {
        var err = new Error('Diese Kategorie existiert nicht.');
        err.status = 400;
        return next(err);
      }
      var startTime = new Date(req.body.startTime);
      var endTime = new Date(req.body.endTime);

      if(!(startTime instanceof Date) || !(endTime instanceof Date)) {
        var err = new Error('Invalides Datum übergeben.');
        err.status = 400;
        return next(err);
      }
      if(req.body.startTime >= req.body.endTime) {
        var err = new Error('Die Startzeit kann nicht nach der Endzeit liegen.');
        err.status = 400;
        return next(err);
      }
      if(req.body.startTime <= req.creationTime || req.body.end <= req.creationTime) {
        var err = new Error('Die Start- und/oder Endzeit liegt in der Vergangenheit.');
        err.status = 400;
        return next(err);
      }
      var henquiry = new Henquiry({
        amountAide: req.body.amountAide,
        createdBy: req.userId,
        creationTime: new Date(),
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        category: {category: categoryParam.category, subcategory: categoryParam.subcategory}
      });
      Henquiry.create(henquiry, function(error, result) {
        if(error) {
          return next(error);
        }
        res.json(result);
      });
    });
};

// Informationen über ein bestimmtes Henquiry laden.
// Unterschieden wird zwischen dem Ersteller und einem Bewerber/Helfer.
exports.getSpecificHenquiry = (req, res, next) => {
  var henquiryId = req.query.henquiryId;
  Henquiry.findById(henquiryId, {"closed":0, "removed":0, "happened":0},function(err, result) {
    if(err) {
      return next(err);
    }
    if(!result) {
      return res.status(404).send("Dieses Hilfsgesuch existiert nicht.");
    }
    if(result.createdBy == req.userId) {
      return res.json(result);
    } else if(result.potentialAide.indexOf(req.userId) > -1 || result.aide.indexOf(req.userId) > -1) {
      result.aide = result.potentialAide = undefined;
      return res.json(result);
    } else {
      return res.status(403).send("Du hast keine Verbindung zu diesem Hilfegesuch.");
    }  
  });
};

// TODO: Benachrichtung schicken
exports.deleteHenquiry = (req, res, next) => {
    var henquiryId = req.body.henquiryId;
    var userId = req.userId; 
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

// ATM: Man kann sich nicht für weitere Henquiries bewerben, wenn man bereits
// 5x an jenem Tag hilft. Frage: was passiert mit Bewerbungen, die am gleichen Tag
// sind und dann angenommen werden? Einfache Lösung: Sobald 5 Bewerbungen da sind,
// aus allen potentialAide-Arrays vom selben Tag streichen
exports.apply = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = new mongoose.mongo.ObjectId(req.userId);
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      return res.send(err); 
    } else {
      var error;
      // Fehler, es werden keine weiteren Bewerber angenommen.
      if(result.closed || result.removed || result.happened) {
        error = new Error('Du kannst dich für dieses Gesuch nicht mehr bewerben.');
        error.status = 402;
      }
      // Fehler, ein Nutzer kann sich nicht bei seinem eigenen Gesuch eintragen
      else if(result.createdBy == req.userId) {
        error = new Error('Du kannst dich nicht bei deinem eigenen Hilfegesuch eintragen.');
        error.status = 402;
      }
      else if(result.potentialAide.indexOf(userId) > -1) {
        // Fehler, man hat sich bereits beworben
        error = new Error('Du hast dich bereits beworben.');
        error.status = 400;
      }
      else if(result.aide.indexOf(userId) > -1) {
        // Fehler, man wurde bereits als Helfer angenommen
        error = new Error('Du bist bereits Helfer.');
        error.status = 401;
      }
      if(error) {
        return next(error);
      }
      Henquiry.find({aide: userId}, function(errCheck, resultCheck) {
        if(errCheck) {return next(errCheck);}
        if(resultCheck) {
          var days = {};
          var date;
          for(var i = 0; i < resultCheck.length; i++) {
            date = resultCheck[i].startTime.getFullYear() + "-" + (resultCheck[i].startTime.getMonth()+1)
            + "-" + resultCheck[i].startTime.getDate();
            if(days[date] === undefined) {
              days[date] = 0;
            }
            days[date]++;
            if(days[date] >= 5) {
              return res.status(400).send("Am " + date + " hilfst du bereits 5x.");
            }
          }
        }
        result.potentialAide.push(userId);
        result.save();
        return res.json(result);
      });
    }
  });
};

// PROBLEM: Was ist bei folgendem Szenario:
// - man hat sich irgendwo beworben
// - der Hilfsbedürftige wählt einen aus
// - man zieht seine Bewerbung zurück, nachdem geprüft wurde, dass
// man im potenialAide-Array ist
// - man wird ins aide-Array eingetragen, obwohl man seine Bewerbung
// "erfolgreich" zurückgezogen hat (=> nach der Prüfung)
exports.acceptApplicants = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var applicants = req.body.applicants;
  var messageData;    
  if(!applicants) {
    var err = new Error('Es wurden keine Bewerber übergeben.');
    err.status = 400;
    return next(err);
  }
  // Da durch applicants iteriert wird, muss es auch bei einem einzigen übergebenen
  // Aide ein Array sein (bei > 1 aider ist es automatisch ein Array)
  if(!(applicants instanceof Array)) {
    applicants = new Array(applicants);
  }
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {return next(err);}
    if(!result) {
      return next(new Error('Das Hilfsgesuch existiert nicht.'));
    }
    if(!(req.userId == result.createdBy)) {
      return next(new Error('Das ist nicht dein eigenes Gesuch.'));
    }
    if(result.removed || result.closed || result.happened) {
      err = new Error('Ungültige Abfrage.');
      err.status = 400;
      return next(err);
    } 
    // In dieser Schleife wird geprüft, ob ein Benutzer bereits als Helfer
    // eingetragen ist bzw. nicht als Bewerber eingetragen ist.
    for(var i = 0; i < applicants.length; i++) {
      if(result.aide.indexOf(applicants[i]) > -1) {
        var err = new Error('Mindestens ein Helfer ist bereits eingetragen.');
        err.status = 400;
        return next(err);
      }
      if(result.potentialAide.indexOf(applicants[i]) == -1) {
        var err = new Error('Mindestens ein Helfer hat sich nicht beworben.');
        err.status = 400;
        return next(err);
      }
    }
    for(var i = 0; i < applicants.length; i++) {
      messageData = {
        aide: applicants[i],
        filer: result.createdBy,
        henquiry: henquiryId,
        messages: {message: "Herzlichen Glückwunsch. Du wurdest als Helfer ausgewählt.", participant: 3, timeSent: new Date()}
      };
      Message.create(messageData, function(msgErr, msgResult) {
        if(msgErr) {
          return next(msgErr);
        }
        msgResult.messages.push({message: "Schön, dass du dir diesen Helfer ausgesucht hast.", participant: 4, timeSent: new Date()});
        msgResult.save();
      });
      result.potentialAide.splice(result.potentialAide.indexOf(applicants[i]),1);
      result.aide.push(applicants[i]);
      result.save(); // Kann man nach jedem mal saven oder erst am ende?
    }
    res.status(204).send();
  });
};

// Hilfsgesuche für neue Bewerber schließen. Henquiry wird nicht mehr angezeigt werden.
exports.closeHenquiry = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) { return next(err);}
    if(!result) {
      err = new Error('Das Hilfegesuch existiert nicht.');
      err.status = 404;
      return next(err);
    }
    if(!(req.userId == result.createdBy)) {
      err = new Error('Das ist nicht dein Hilfegesuch.');
      err.status = 403;
      return next(err);
    }
    // Eine if-Abfrage, statt drei wie in henquirySuccess.
    if(result.closed || result.happened || result.removed) {
      err = new Error('Ungültige Anfrage.');
      err.status = 400;
      return next(err);
    }
    if(result.aide.length < 1) {
      console.log("Länge kleiner 1");
      err = new Error('Du kannst ein Hilfegesuch nicht schliessen, wenn keine Helfer vorhanden sind.');
      err.status = 400;
      return next(err);
    }
    result.closed = true;
    result.save();
    res.send("ok");
  });
};

// TODO: Terra gutschreiben
exports.henquirySuccess = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  Henquiry.findById(henquiryId, function(err, result) {
    if(err) {
      return res.send(err);
    }
    if(!result) {
      err = new Error('Das Hilfegesuch existiert nicht.');
      err.status = 404;
      return next(err);
    }
    if(!result.closed || result.removed || result.happened) {
      err = new Error('Ungültige Abfrage.');
      err.status = 400;
      return next(err);
    }
    if(!(result.createdBy == req.userId)) {
      err = new Error('Das ist nicht dein Hilfegesuch.');
      err.status = 403;
      return next(err);
    }
    result.happened = true;
    result.save();
    Message.find({henquiry: henquiryId}, function(err, result) {
      if(err) {return next(err);}
      if(!result) {
        res.send("Es existieren keine Messages zu diesem Henquiry.");
      }
      for(var i = 0; i < result.length; i++) {
        result[i].readOnly = true;
        result[i].save();
      }
      res.send(result);
    });
  });
};

// TODO: Benachrichtigung an den Filer, falls der Aide im aide-Array war
exports.cancelApplication = (req, res, next) => {
  var henquiryId = req.body.henquiryId;
  var userId = new mongoose.mongo.ObjectId(req.userId);
  Henquiry.findById(henquiryId, function(err, result) {
    if(!result) {
      return next(new Error('Das Hilfsgesuch existiert nicht.'));
    }
    if(result.happened || result.removed) {
      err = new Error('Das Hilfsgesuch ist nicht aktuell.');
      err.status = 400;
      return next(err);
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
  res.status(204).send();
};

exports.calendar = (req, res, next) => {
  var userId = req.userId;
  Henquiry.find({
    $and: [
      {$or: [{createdBy: userId}, {potentialAide: userId}, {aide: userId}]},
      {happened: false}
    ]
  }, function(err, result) {
    if(err) {
      return next(err);
    }
    res.json(result);
  });
};

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
    /*if(!result.happened || !result.closed || result.removed) {
      err = new Error('Ungültige Anfrage.');
      err.status = 400;
      return next(err);
    }
    if(result.aide.length == 0) {
      err = new Error('Es wurden bereits alle Helfer bewertet.');
      err.status = 400;
      return next(err);
    }*/
    
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
setInterval(() => {
  Henquiry.find({closed: false, happened: false, removed: false}, function(err, result) {
    if(err) {return next(err);}
    if(!result) {return;}
    for(var i = 0; i < result.length; i++) {
      if(result[i].startTime < new Date()) {
        if(result[i].aide.length == 0) {
          result[i].removed = true;
        } else {
          result[i].closed = true;
        }
      }
    }
  });
},100000);