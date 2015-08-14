var express = require('express');
var router = express.Router();
var mass_importer = require('../libs/mass_importer');
var winston = require('winston');

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
  mass_importer.import(logger, function(err) {
    if(err) {
      logger.error(err);
    }
    
    return res.send(200,logger.result);
  });
    
});

module.exports = router;
