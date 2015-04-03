var mongodb = require('../libs/mongodb.js');
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');

module.exports.find = function(query, cb) {
	var filter = meeting_query.parseQueryString({});
    var query = meeting_query.buildMongoQuery(filter);

    var meetings = mongodb.db.collection('meetings');
    meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);

}