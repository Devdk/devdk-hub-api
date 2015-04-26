var express = require('express');
var meeting_query = require('../libs/meetings_query.js');
var router = express.Router();
var config = require('../config.js');
var meetings = require("../libs/meetings.js");

router.get('/', function(req, res) {
    var filter = meeting_query.parseQueryString(req.query);
    var query = meeting_query.buildMongoQuery(filter);

    meetings.find(query, function (err, items) {
        if(err) {
            throw err;
        }
        res.json(items);
    });
});

router.put('/', function(req, res) {
    var meeting = req.body;

    meetings.insert(meeting, function(err, meeting) {
        if(err) {
            if(err instanceof meetings.ValidationError) {
                res.status(400);
                res.send(err);
                return;                
            } else {
                throw err;
            }
        }
        res.json(meeting);
    });
});

router.post('/', function(req, res) {
    var meeting = req.body;

    meetings.update(meeting, function(err, meeting) {
        if(err) {
            if(err instanceof meetings.ValidationError) {
                res.status(400);
                res.send(err);
                return;                
            } else {
                throw err;
            }
        }
        res.json(meeting);
    });
});

module.exports = router;
