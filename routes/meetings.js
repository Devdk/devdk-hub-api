var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var config = require('../config.js');

router.get('/', parseMeetingFilters, function(req, res, next) {

    query = {}
    
    if(req.filters.after) {
        addFunctionFilter(query, "starts_at", "$gte", Date.parse(req.filters.after));
    }
    if(req.filters.before) {
        addFunctionFilter(query, "starts_at", "$lte", Date.parse(req.filters.before));
    }
    if(req.filters.tags) {
        addFunctionFilter(query, "tags", "$in", req.filters.tags);
    }
    if(req.filters.organizers) {
        addFunctionFilter(query, "organizers", "$in", req.filters.organizers);
    }
    if(req.filters.cities) {
        addFunctionFilter(query, "city", "$in", req.filters.cities);
    }

    MongoClient.connect(config.mongodbUrl, function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.find(query).toArray(function (err, items) {
              res.send(items);
            });
        }
    });
});

function addFunctionFilter(queryObject, attribute, functionName, value) {
    queryObject[attribute] = queryObject[attribute] || {};
    queryObject[attribute][functionName] = value;
}

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
