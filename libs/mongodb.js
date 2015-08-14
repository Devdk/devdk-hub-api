var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

var MongoDB = {
  init: function(callback) {
    
    if(this.db != null) {
      callback();
      return;
    }
    
  	MongoClient.connect(config.mongodbUrl, function(err, db) {
  		if(!err) {
  			this.db = db;
  		}
  
  		return callback(err);
  	}.bind(this));
  },
  db: null
};

module.exports = MongoDB;