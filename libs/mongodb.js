var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');

module.exports.init = function(callback) {
	MongoClient.connect(config.mongodbUrl, function(err, db) {
		if(!err) {
			module.exports.db = db;
		}

		callback(err);
	});
}