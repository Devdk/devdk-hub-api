var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var config = require('../config.js');

router.get('/', function(req, res, next) {
    var filter = buildMeetingFilterFromQuery(req.query);
    var query = buildMeetingQuery(filter);

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

function buildMeetingFilterFromQuery(query) {
    var filters = {
        after: query.after ? Date.parse(query.after) : null,
        before: query.before ? Date.parse(query.before) : null,
        tags: query.tags ? query.tags.split(',') : null,
        organizers: query.organizers ? query.organizers.split(',') : null,
        cities: query.cities ? query.cities.split(',') : null
    };
    return filters;
}

function buildMeetingQuery(filter) {
    query = {}
    
    if(filter.after) {
        addFunctionFilter(query, "starts_at", "$gte", filter.after);
    }
    if(filter.before) {
        addFunctionFilter(query, "starts_at", "$lte", filter.before);
    }
    if(filter.tags) {
        addFunctionFilter(query, "tags", "$in", req.filters.tags);
    }
    if(filter.organizers) {
        addFunctionFilter(query, "organizers", "$in", req.filters.organizers);
    }
    if(filter.cities) {
        addFunctionFilter(query, "city", "$in", req.filters.cities);
    }

    return query;
}

module.exports = router;
