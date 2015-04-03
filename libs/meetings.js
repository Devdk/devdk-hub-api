var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');

module.exports.find = function(query, cb) {
	var filter = meeting_query.parseQueryString({});
    var query = meeting_query.buildMongoQuery(filter);

    MongoClient.connect(config.mongodbUrl, function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);
        }
    });
}