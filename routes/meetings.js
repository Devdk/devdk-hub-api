var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var config = require('../config.js');

router.get('/', parseMeetingFilters, function(req, res, next) {

    MongoClient.connect(config.mongodbUrl, function(err, db) {
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
    		if(req.filters.tags) {
    			query.tags = query.tags || {};
    			query.tags['$in'] = req.filters.tags;
    		}
    		if(req.filters.organizers) {
    			query.organizers = query.organizers || {};
    			query.organizers['$in'] = req.filters.organizers;
    		}
    		if(req.filters.cities) {
    			query.city = query.city || {};
    			query.city['$in'] = req.filters.cities;
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
		before: req.query.before,
		tags: req.query.tags ? req.query.tags.split(',') : null,
		organizers: req.query.organizers ? req.query.organizers.split(',') : null,
		cities: req.query.cities ? req.query.cities.split(',') : null
	};

	next();

}

module.exports = router;
