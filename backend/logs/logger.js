var winston = require('winston');
var logger = winston.createLogger({
  level: 'error',
  transports: [
    new (winston.transports.File)({filename: 'logs/error.log'})
  ]
});

module.exports = logger;