var MongoClient = require('mongodb').MongoClient;
var config = require('../config');
var mongodb = require('../libs/mongodb');

config.mongodbUrl = 'mongodb://localhost:27017/hub_test';

before(function(done) {
	mongodb.init(done);
});

var TestHelper = {

  clearDB: function(done) {
    mongodb.db.collection('meetings').remove({}, done);
  },

  setupDatabase: function(done) {
  	this.clearDB(done);
  },
  
};

module.exports = TestHelper;