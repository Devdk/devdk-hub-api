var mongodb = require('../libs/mongodb.js');
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');
var meetingSchema = require('./../public/schemas/meeting_schema.json');
var async = require('async');
var jsonValidator = require('./json_validator');

var ValidationError = function(validationResult) {
  this.validationResult = validationResult;
};

module.exports.find = function(query, cb) {
  var meetings = mongodb.db.collection('meetings');
  meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);
};

module.exports.insert = function(meeting, cb) {

  meeting.created_at = new Date().getTime();
  var validationResult = jsonValidator.validate(meeting, meetingSchema);
  if(!validationResult.valid) {
    cb(new ValidationError(validationResult), null);
    return;
  }

  var meetings = mongodb.db.collection('meetings');
  meetings.insert(meeting, function(err, doc) {

    if(err) {
      cb(err, null);
      return;
    }
    cb(null, doc.ops[0]);
  });
};

module.exports.update = function(meeting, cb) {
  var validationResult = jsonValidator.validate(meeting, meetingSchema);
  if(!validationResult.valid) {
    cb(new ValidationError(validationResult), null);
    return;
  }

  var meetings = mongodb.db.collection('meetings');

  meetings.save(meeting, function(err) {
    if(err) {
      cb(err, null);
      return;
    }
    cb(null, meeting);
  });
};

module.exports.batchUpdateFromSource = function(meetings, cb) {
  var meetingsCollection = mongodb.db.collection('meetings');
  var inserted = 0, updated = 0;
  var operations = meetings.map(function(meeting) {
    return function(cb) {
        meetingsCollection.update(
           { 
             'source.source_type': meeting.source.source_type,
             'source.source_id': meeting.source.source_id
            },
           meeting,
           {
             upsert: true
           },
           function(err, data) {
          
             if(data.result.nModified == 1) {
               updated += 1;
             } else {
               inserted += 1;
             }
             
             cb(err,data);
           }
        );      
    };
  });
  
  async.series(operations, function(err) {
    cb(err, {
      inserted: inserted,
      updated: updated
    });
  });
};

module.exports.ValidationError = ValidationError;
