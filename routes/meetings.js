var express = require('express');
var meeting_query = require('../libs/meetings_query.js');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var config = require('../config.js');

router.get('/', function(req, res, next) {
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

module.exports = router;
