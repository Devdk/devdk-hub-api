var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');

config.mongodbUrl = 'mongodb://localhost:27017/hub_test';

module.exports.clearDB = function(done) {
    MongoClient.connect(config.mongodbUrl, function(err, db) {
	    if(!err) {
	        db.dropDatabase();
	        done();
	    }
    });
}