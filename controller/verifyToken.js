var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/user'); //
function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (typeof token == 'undefined') {
    return res.status(400).send({ auth: false, message: 'No token provided.' });
  }
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
    if (!token) {
        return res.status(400).send({ auth: false, message: 'No token provided.' });
    }
  }
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
    return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    /*User.findById(req.userId, function (errUser, resultUser) {
      if(errUser) {

      }
      if(!resultUser) {

      }
      if(resultUser.invite.level == 3 && req.originalUrl !== '/profile/verify') {
        console.log(req.originalUrl);
        // Keine Verifizierung vorhanden, also kann man nichts machen
        return res.status(403).send("Verifizier dich.");
      }
    });*/
    next();
  });
}
module.exports = verifyToken;