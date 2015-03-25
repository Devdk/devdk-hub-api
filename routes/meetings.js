var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
    MongoClient.connect("mongodb://localhost:27017/hub", function(err, db) {
        if(!err) {
            var meetings = db.collection('meetings');
            meetings.find().toArray(function (err, items) {
              res.send(items);
            });
        }
    });
});

module.exports = router;
