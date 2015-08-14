var express = require('express');
var router = express.Router();
var mass_importer = require('../libs/mass_importer');
var config = require('../config');

var Logger = function() {
  this.result = '';
}

Logger.prototype.info = function(msg) {
  this.result += msg + '<br/>';
}


Logger.prototype.error = function(msg) {
  this.result += "<span style='color:red'>" + msg + '</span><br/>';
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var logger = new Logger();
  var importerConfig = { meetupKey: req.query.apikey || config.meetupKey };

  mass_importer.import(logger, importerConfig, function(err) {
    if(err) {
      logger.error(err.stack);
    }
    
    return res.send(logger.result);
  });
    
});

module.exports = router;
