var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sandbox');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard', // has to be changed
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Checks, whether the user is logged in or not.
// TODO Für den Gastmodus könnte man einen weiteren Router vor dieser Middle
// einfügen. Wenn man nämlich nicht eingeloggt ist, soll diese Middleware immer auf
// den Login redirecten.
app.use(function(req, res, next) {
  if(req.session.userId) {
    console.log("app.js :: logged in, userId: " + req.session.userId);
  } else {
    console.log("app.js :: is not logged in");
  }
  next();
})

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

// listen on port 3000
app.listen(12345, function () {
  console.log('Express app listening on port 12345');
});

module.exports = app;