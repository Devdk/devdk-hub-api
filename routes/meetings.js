var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

router.get('/', parseMeetingFilters, function(req, res, next) {

    MongoClient.connect("mongodb://localhost:27017/hub", function(err, db) {
        if(!err) {
    		query = {}
    		if(req.filters.after) {
    			query.starts_at = query.starts_at || {};
    			query.starts_at["$gte"] = Date.parse(req.filters.after);
    		}
    		if(req.filters.before) {
    			query.starts_at = query.starts_at || {};
    			query.starts_at["$lte"] = Date.parse(req.filters.before);
    		}

            var meetings = db.collection('meetings');
            meetings.find(query).toArray(function (err, items) {
              res.send(items);
            });
        }
    });
});

function parseMeetingFilters(req, res, next) {
	
	req.filters = {
		after: req.query.after,
		before: req.query.before
	};

	next();

}

module.exports = router;
