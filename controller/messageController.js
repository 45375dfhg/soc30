var Message = require('../models/message');

exports.messages_get = (req, res, next) => {
    var userId = req.userId; // SESSION
    Message.find({$or: [{aide: userId}, {filer: userId}]}, function(err, result) {
        res.json(result);
    });
};

// param: a) henquiryId zu der die message gehört b) nachricht
// TODO Prüfen, ob man wirklich in diesem henquiry eingetragen ist
exports.messages_post = (req, res, next) => {
    var userId = req.userId; // SESSION
    // TODO Nachricht trimmen
    var msg = req.body.message;
    Message.findOne({henquiry: req.body.henquiryId}, function(error, result) {
        if(error) {
            return next(error);
        }
        console.log(result);
        // 1: Filer, 2: Aide
        var participant = result.filer == userId ? 1 : 2;
        result.messages.push({message: msg, participant: participant});
        result.save();
        res.json("ok");
    });
};