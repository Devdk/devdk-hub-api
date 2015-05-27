var mongodb = require('../libs/mongodb.js');
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');
var meetingSchema = require('./../public/schemas/meeting_schema.json');
var async = require('async');
var jsonValidator = require('./json_validator');

/** A simple ValidationError object */
var ValidationError = function(validationResult) {
  this.validationResult = validationResult;
};

/**
 * Sets the default attributes that all new meetings must have.
 */
function setDefaultMeetingAttributes(meeting) {
  meeting.created_at = new Date().getTime();
  meeting.is_deleted = false;
}

/**
 * Gets the inserted document from a mongodb insert result.
 */
function getInsertedDocument(result) {
  return result.ops[0];
}

/**
 * Gets the meeting collection from MongoDB.
 */
function getMeetingsCollection() {
  return mongodb.db.collection('meetings')
}

/**
 * Validates a meeting, if invalid it will call the callback with a ValidationError
 */
function validateMeeting(meeting, callback) { 
  var validationResult = jsonValidator.validate(meeting, meetingSchema);
  if(!validationResult.valid) {
    callback(new ValidationError(validationResult), null);
    return false;
  }
  
  return true;
}

/**
 * Find a meeting object using a mongo query
 * 
 * @param query The query to find the meeting by
 */
module.exports.find = function(query, cb) {
  var meetings = getMeetingsCollection();
  
  query = query || {};
  
  // We don't want to find deleted meetings
  query.is_deleted = { '$ne': true };
  
  meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);
};

/**
 * Inserts a meeting record if the record is valid.
 * 
 * @param meeting The meeting to insert
 * @param callback The callback to invoke. Will contain the inserted document from MongoDB if success.
 */
module.exports.insert = function(meeting, callback) {

  setDefaultMeetingAttributes(meeting);
  
  if(!validateMeeting(meeting, callback)) {
    return;
  }
  
  var meetings = getMeetingsCollection();
  
  meetings.insert(meeting, function(err, result) {

    if(err) {
      callback(err, null);
      return;
    }
    callback(null, getInsertedDocument(result));
  });
};

/**
 * Saves a meeting
 * 
 * @param meeting The meeting to save
 * @param callback The callback, will get the meeting returned. 
 */
module.exports.save = function(meeting, callback) {
  var validationResult = jsonValidator.validate(meeting, meetingSchema);
  if(!validationResult.valid) {
    callback(new ValidationError(validationResult), null);
    return;
  }

  var meetings = getMeetingsCollection();

  meetings.save(meeting, function(err) {
    if(err) {
      callback(err, null);
      return;
    }
    callback(null, meeting);
  });
};

module.exports.batchUpdateFromSource = function(meetings, cb) {
  var meetingsCollection = getMeetingsCollection();
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
