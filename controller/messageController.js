var Message = require('../models/message');
var mongoose = require('mongoose');

exports.messagesOverview = (req, res, next) => {
    var userId = req.userId;
    Message.find({$or: [{aide: userId}, {filer: userId}]})
    .select('filer aide readAide readFiler henquiry')
    .exec(function(err, result) {
        if(err) {
            return next(err);
        }
        // Aus jedem Chatverlauf nur seinen eigenen Lesestatus anzeigen
        // (also ob man eine neue Nachricht hat oder nicht)
        for(var i = 0; i < result.length; i++) {
            if(result[i].aide == userId) {
                result[i].readFiler = undefined;
            } else {
                result[i].readAide = undefined;
            }
        }
        res.json(result);
    });
};

exports.messagesSpecific = (req, res, next) => {
    var userId = req.userId;
    var messageId = req.body.messageId;
    Message.findById(messageId, function(err, result) {
        if(err) {return next(err);}
        if(!result) {
            var err = new Error('Nachrichtenverlauf existiert nicht.');
            err.status = 404;
            return next(err);
        }
        if(result.aide == userId || result.filer == userId) {
            var role = result.aide == userId ? 3 : 4;
            var copiedResult = JSON.parse(JSON.stringify(result));
            if(result.aide == userId) {
                result.readAide = true;
            } else {
                result.readFiler = true;
            }
            result.save();
            copiedResult.readAide = copiedResult.readFiler = undefined;
            for(var i = 0; i < copiedResult.messages.length; i++) {
                if(copiedResult.messages[i].participant == 3 && role == 4) {
                    console.log("Spliced 1, Index: " + i);
                    copiedResult.messages.splice(i,1);
                    i--;
                } else if(copiedResult.messages[i].participant == 4 && role == 3) {
                    console.log("Spliced 2");
                    copiedResult.messages.splice(i,1);
                    i--;
                }
            }
            res.json(copiedResult);
        } else {
            var err = new Error('Das ist nicht dein Nachrichtenverlauf.');
            err.status = 403;
            return next(err);
        }
    });
};

// param: a) henquiryId zu der die message gehört b) nachricht c) messageId
// 1: Aide, 2: Filer
exports.sendMessage = (req, res, next) => {
    var userId = req.userId;
    // TODO Nachricht trimmen
    var msg = req.body.message;
    var messageId = req.body.messageId;
    Message.findById(messageId, function(err, result) {
        if(err) {return next(err);}
        console.log(result);
        if(!result) {
            var err = new Error('Nachrichtenverlauf existiert nicht.');
            err.status = 404;
            return next(err);
        }
        if(result.readOnly) {
            var err = new Error('Nachrichten können nicht mehr geschickt werden.');
            err.status = 403;
            return next(err);
        }
        if(result.aide == userId || result.filer == userId) {
            var participant = result.aide == userId ? 1 : 2;
            result.messages.push({message: msg, participant: participant});
            if(participant == 1) {
                result.readFiler = false;
            } else {
                result.readAide = false;
            }
            result.save();
            res.json(result);
        } else {
            var err = new Error('Das ist nicht dein Nachrichtenverlauf.');
            err.status = 403;
            return next(err);
        }
    });
};