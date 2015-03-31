var express = require('express');
var meeting_query = require('../libs/meetings_query.js');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var JsonValidator = require('jsonschema').Validator;
var config = require('../config.js');
var jsonValidator = new JsonValidator();

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
    var meeting = req.body;
    meeting.created_at = new Date().getTime();

    var validationResult = jsonValidator.validate(meeting, meetingsSchema);
    if(!validationResult.valid) {
        res.status(400);
        res.send(validationResult);
        return;
    }

    MongoClient.connect(config.mongodbUrl, function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.insert(meeting, function(err, doc) {
                res.send(doc.ops[0]);
            });
        }
    });
});

var meetingsSchema = {
    "title": "Meeting",
    "type": "object",
    "properties": {
        "title": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "starts_at": {
            "type": "number"
        },
        "city": {
            "type": "string"
        },
        "tags": {
            "items": {
                "type": "string"
            },
            "uniqueItems": true
        },
        "organizers": {
            "items": {
                "type": "string"
            },
            "uniqueItems": true
        },     

    },
    "required": ["title", "description", "starts_at", "city"]
};

module.exports = router;
