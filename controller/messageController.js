var Message = require('../models/message');
var logger = require('../logs/logger');

exports.messagesOverview = (req, res, next) => {
    var userId = req.userId;
    Message.find({
        $and:[
            {$or: [{aide: userId}, {filer: userId}]},
            {readOnly: false}
        ]
    })
    .select('filer aide readAide readFiler henquiry')
    .populate('filer', 'firstname surname nickname avatar address')
    .populate('aide', 'firstname surname nickname avatar')
    .populate('henquiry', 'category amountAide startTime endTime potentialAide createdBy aide ratedAide ratedFiler closed removed happened')
    .exec(function(err, result) {
        if(err) {
            logger.log('error', new Date() + 'GET/messages/overview, Code: BA_001, Error:' + err);
            return res.status(500).send("BA_001");
        }
        if(!result) {
            return res.status(404).send("BA_002");
        }
        // Messages werden nicht geschickt, wenn bereits bewertet wurde
        for(var i = 0; i < result.length; i++) {
            // Man ist Aide
            if(result[i].henquiry._id == '5c0e7d20e47c2d6d61f6fb20') {
                console.log(result[i]);
            }
            if(result[i].aide._id == userId) {
                if(result[i].henquiry._id == '5c0e7d20e47c2d6d61f6fb20') {
                    console.log(result[i]);
                }
                console.log("1");
                //console.log(result[i]);
                if(result[i].henquiry.ratedFiler.indexOf(result[i].aide._id) > -1) {
                    console.log("2");
                    result.splice(i,1);
                }
            } else {
                console.log("3");
                //console.log(result[i]);
                if(result[i].henquiry.ratedAide.indexOf(result[i].aide._id) > -1) {
                    console.log("4");
                    result.splice(i,1);
                }
            }
        }
        for(var i = 0; i < result.length; i++) {
            if(result[i].henquiry.removed) {
                result.splice(i,1);
            }
        }
        // Aus jedem Chatverlauf nur seinen eigenen Lesestatus anzeigen
        // (also ob man eine neue Nachricht hat oder nicht)
        for(var i = 0; i < result.length; i++) {
            if(result[i].aide._id == userId) {
                result[i].readFiler = result[i].henquiry.potentialAide = result[i].henquiry.aide = result[i].henquiry.ratedAide = result[i].henquiry.ratedFiler = undefined;
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
    .populate('henquiry', 'potentialAide aide closed removed happened')
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