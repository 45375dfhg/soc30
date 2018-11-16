var User = require('../models/user');
var Henquiry = require('../models/henquiry');
var path = require('path');

// Fetch all henquiries
exports.henquiries_get = function(req, res, next) {
    Henquiry.find({})
    .select('created: 1')
    .populate('createdBy', 'email username') // aide und potentialAide muss populated werden
    //.populate('aide', 'email username')
    //.populate('potentialAide', 'email username')
    .exec(function (err, list_henquiries) {
      //return res.json(list_henquiries);
    });
    return res.sendFile(path.join(path.dirname(__dirname) + '/public/noindex.html'));
};

exports.henquiries_create = function(req, res, next) {
    var henquiry = new Henquiry({
      category: req.body.category,
      text: req.body.message,
      postalcode: req.body.postalcode,
      createdBy: req.session.userId,
      creationTime: new Date(),
      startTime: new Date(),
      endTime: new Date()
    });
    User.find({}, function(err, result) {
      henquiry.createdBy = req.session.userId;
      henquiry.save(function (err) {
        if (err) {return next(err);}
        res.send(henquiry + ' wurde gespeichert. Zurück zu <a href="/henquiries">Hilfegesuchen</a>.');
      });
    });
};


exports.calendar = (req, res, next) => {
  Henquiry.find({'potentialAide' : { $in: req.session.userId}}, function(err, docs) {
    return res.json(docs);
  });
};