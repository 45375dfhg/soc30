var Message = require('../models/message');
var logger = require('../logs/logger');

exports.messagesOverview = (req, res, next) => {
    var userId = req.userId;
    Message.find({$or: [{aide: userId}, {filer: userId}]})
    .select('filer aide readAide readFiler henquiry')
    .populate('filer', 'firstname surname nickname avatar address')
    .populate('aide', 'firstname surname nickname avatar')
    .populate('henquiry', 'category amountAide startTime endTime')
    .exec(function(err, result) {
        if(err) {
            logger.log('error', new Date() + 'GET/messages/overview, Code: BA_001, Error:' + err);
            return res.status(500).send("BA_001");
        }
        if(!result) {
            return res.status(404).send("BA_002");
        }
        // Aus jedem Chatverlauf nur seinen eigenen Lesestatus anzeigen
        // (also ob man eine neue Nachricht hat oder nicht)
        for(var i = 0; i < result.length; i++) {
            if(result[i].aide._id == userId) {
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
    Message.findById(messageId)
    .populate('filer', 'firstname surname nickname avatar')
    .populate('aide', 'firstname surname nickname avatar')
    .populate('henquiry', 'potentialAide aide')
    .exec(function(err, result) {
        if(err) {
            logger.log('error', new Date() + 'GET/messages/specific, Code: BB_001, Error:' + err);
            return res.status(500).send("BB_001");
        }
        if(!result) {
            return res.status(404).send("BB_003");
        }
        if(result.aide._id == userId || result.filer._id == userId) {
            var role = result.aide._id == userId ? 3 : 4;
            if(role == 3) {
                result.henquiry.potentialAide = result.henquiry.aide = undefined;
            }
            var copiedResult = JSON.parse(JSON.stringify(result));
            if(result.aide._id == userId) {
                result.readAide = true;
            } else {
                result.readFiler = true;
            }
            result.save();
            copiedResult.readAide = copiedResult.readFiler = undefined;
            for(var i = 0; i < copiedResult.messages.length; i++) {
                if(copiedResult.messages[i].participant == 3 && role == 4) {
                    //console.log("Spliced 1, Index: " + i);
                    copiedResult.messages.splice(i,1);
                    i--;
                } else if(copiedResult.messages[i].participant == 4 && role == 3) {
                    //console.log("Spliced 2");
                    copiedResult.messages.splice(i,1);
                    i--;
                }
            }
            res.json(copiedResult);
        } else {
            return res.status(403).send("BB_002");
        }
    });
};

// param: a) henquiryId zu der die message gehört b) nachricht c) messageId
// 1: Aide, 2: Filer
exports.sendMessage = (req, res, next) => {
    var userId = req.userId;
    var msg = req.body.message;
    var messageId = req.body.messageId;
    Message.findById(messageId, function(err, result) {
        if(err) {
            logger.log('error', new Date() + 'POST/messages/specific, Code: BC_001, Error:' + err);
            return res.status(500).send("BC_001");
        }
        if(!result) {
            return res.status(404).send("BC_002");
        }
        if(result.readOnly) {
            return res.status(400).send("BC_003");
        }
        if(result.aide._id == userId || result.filer._id == userId) {
            var participant = result.aide._id == userId ? 1 : 2;
            result.messages.push({message: msg, participant: participant});
            if(participant == 1) {
                result.readFiler = false;
            } else {
                result.readAide = false;
            }
            result.save();
            return res.send("");
        } else {
            return res.status(403).send("BC_004");
        }
    });
};