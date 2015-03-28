var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

router.get('/', parseMeetingFilters, function(req, res, next) {

    MongoClient.connect("mongodb://localhost:27017/hub", function(err, db) {
        if(!err) {
    		query = {}
    		if(req.filters.after) {
    			"starts_at" : {"$gte": Date.parse(req.filters.after)}
    		}

            var meetings = db.collection('meetings');
            meetings.find(query).toArray(function (err, items) {
              res.send(items);
            });
        }
    });
});

function parseMeetingFilters(req, res, next) {

	req.filtes = {
		after: req.query.after
	};

}

module.exports = router;
