var express = require('express');
var router = express.Router();
var config = require('../config');
var mongodb = require('../libs/mongodb');
  
/**
 * @api {get} /logs/ Gets all the logs
 * @apiName GetLogs
 * @apiGroup Logs
 *
 * @apiSuccess {Object[]} . list of the logs
 */
router.get('/', function(req, res, next) {

    mongodb.db.collection('log').find({}).toArray(function(err, items) {
        if(err) {
            return next(err);
        }
        console.log(items);
        res.json(items);
    });
});

module.exports = router;
