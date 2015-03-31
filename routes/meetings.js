var express = require('express');
var meeting_query = require('../libs/meetings_query.js');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var config = require('../config.js');

router.get('/', function(req, res) {
    var filter = meeting_query.parseQueryString(req.query);
    var query = meeting_query.buildMongoQuery(filter);

    MongoClient.connect(config.mongodbUrl, function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.find(query).toArray(function (err, items) {
              res.send(items);
            });
        }
    });
});

router.post('/', function(req, res) {
    var meeting = createMeetingFrom(req.body);
    meeting.created_at = new Date().getTime();

    MongoClient.connect(config.mongodbUrl, function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.insert(meeting, function(err, doc) {
                res.send(doc.ops[0]);
            });
        }
    });
});

function createMeetingFrom(data) {
    var attributes = ["title", "starts_at", "description", "url", "tags", "organizers", "city"];
    var parsers = {
        "starts_at": Date.new,
        "created_at": Date.new
    }
    var newObject = {};
    for(var x = 0; x<= attributes.length; x++) {
        var attribute = attributes[x];
        if(data[attribute] !== undefined) {
            var parser = parsers[attribute] !== undefined ? parsers[attribute] : nullParser;
            
            newObject[attribute] = parser(data[attribute]);
        }
    }

    return newObject;
}

function nullParser(x) {
    return x;
}

module.exports = router;
