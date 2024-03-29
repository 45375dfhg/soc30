var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');

//connect to MongoDB

// TODO: Auth-Daten in eine externe Datei auslagern, damit die hier nicht sichtbar sind
// TODO: Neue Version auf den Server laden, bei Henquiries die Datumsprüfung erstmal rausnehmen
// TODO: DB mit neuen Daten populaten
mongoose.connect(config.database,{ useNewUrlParser: true });
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(config.port, function () {
  console.log('Express app listening on port ' + config.port);
});

module.exports = app;