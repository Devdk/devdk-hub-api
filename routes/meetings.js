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
        res.json(items.map(toPublicMeeting));
    });
});

router.get('/:id', function(req, res) {
    var _id = req.params.id;

    meetings.find({'_id': _id}, function(err, items) {
        if(err) {
            throw err;
        }
        if(items.length == 0) {
            res.status(404);
            res.send({ message: "Not found: " + _id });
            return;
        }
        res.json(toPublicMeeting(items[0]));       
    })
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

router.post('/:id', function(req, res) {
    var id = req.params.id;
    var meeting = req.body;

    meeting._id = id;

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

function toPublicMeeting(m) {
    return {
        '_id': m._id,
        'title': m.title,
        'starts_at': m.starts_at,
        'created_at': m.created_at,
        'description': m.description,
        'url': m.url,
        'tags': m.tags,
        'organizers': m.organizers,
        'city': m.city
    }
}

module.exports = router;
