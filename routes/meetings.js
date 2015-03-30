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

module.exports = router;
