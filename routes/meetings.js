var express = require('express');
var meeting_query = require('../libs/meetings_query');
var router = express.Router();
var config = require('../config');
var meetings = require("../libs/meetings");

/**
 * @api {get} /meetings/ Get a list of meetings
 * @apiName GetMeetings
 * @apiGroup Meetings
 *
 * @apiParam {Date} after only return meetings after the date.
 * @apiParam {Date} before only return meetings before the date.
 * @apiParam {string} tags only return meetings containing at least one of the tags (comma-seperate).
 * @apiParam {string} organizers only return meetings containing at least one of the organizers (comma-seperate).
 * @apiParam {string} cities only return meetings containing at least one of the cities (comma-seperate).
 *
 * @apiSuccess {Object[]} . list of the meetings
 */
router.get('/', function(req, res, next) {
    var filter = meeting_query.parseQueryString(req.query);
    var query = meeting_query.buildMongoQuery(filter);

    meetings.find(query, function (err, items) {
        if(err) {
            return next(err);
        }
        res.json(items.map(toPublicMeeting));
    });
});

/**
 * @api {get} /meetings/:id Get a meeting
 * @apiName GetMeeting
 * @apiGroup Meetings
 * @apiSuccess {Object} . meeting
 */
router.get('/:id', function(req, res, next) {
    var _id = req.params.id;

    meetings.get(_id, function(err, item) {
      if(err) {
        next(err);
      }
      if(!item) {
        res.status(404);
        res.send({ message: "Not found: " + _id });
        return;
      }
      res.json(toPublicMeeting(item));     
    });
});

/**
 * @api {post} /meetings/ Create a new meeting
 * @apiDescription Must pass a validation check against this <a href="/schemas/meeting_schema.json">jsonSchema</a>.
 * @apiName CreateMeeting
 * @apiGroup Meetings
 */
router.post('/', function(req, res, next) {
    var meeting = req.body;

    meetings.insert(meeting, function(err, meeting) {
        if(err) {
            if(err instanceof meetings.ValidationError) {
                res.status(400);
                res.send(err.validationResult);
                return;                
            } else {
                next(err);
            }
        }
        res.status(201);
        res.location('/meetings/' + meeting._id);
        res.end();
    });
});

/**
 * @api {put} /meetings/ Update a meeting
 * @apiDescription Must pass a validation check against this <a href="/schemas/meeting_schema.json">jsonSchema</a>.
 * @apiName UpdateMeeting
 * @apiGroup Meetings
 */
router.put('/:id', function(req, res, next) {
    var id = req.params.id;
    var meeting = req.body;

    meetings.save(id, meeting, function(err, meeting) {
        if(err) {
            if(err instanceof meetings.ValidationError) {
                res.status(400);
                res.send(err.validationResult);
                return;                
            } else {
                next(err);
            }
        }
        res.status(200);
        res.end();
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
        'city': m.city,
        'source': m.source
    }
}

module.exports = router;
