var express = require('express');
var router = express.Router();
var meetup_groups = require('../libs/meetup_groups');

/**
 * @api {get} /meetup_groups/ Get a list of meetup groups
 * @apiDescription Gets a list of meetup groups that the API will fetch meetings from
 * @apiName GetMeetupGroups
 * @apiGroup MeetupGroups
 *
 * @apiSuccess {Object[]} . list of the meetup groups
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     { 
 *       "meetupUrl": "dwodense",
 *       "organizerName": "Design and Web Development Odense",
 *       "city": "Odense",
 *       "tags": [ "web" ]
 *     }
 */
router.get('/', function(req, res, next) {
  meetup_groups.list(function(err, result) {
    res.json(result);
  })
});

module.exports = router;
