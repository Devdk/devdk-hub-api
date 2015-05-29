var mongodb = require('../libs/mongodb');
var config = require('../config');
var meeting_query = require('../libs/meetings_query');
var meetingSchema = require('./../public/schemas/meeting_schema.json');
var async = require('async');
var jsonValidator = require('./json_validator');
var ObjectID = require('mongodb').ObjectID;

var Meetings = {
  
  /**
  * Find a meeting object using a mongo query
  * 
  * @param query The query to find the meeting by
  */
  find: function(query, cb) {
    var meetings = this._getMeetingsCollection();
    
    query = query || {};
    
    // We don't want to find deleted meetings
    query.is_deleted = { '$ne': true };
    
    meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);
  },
  
  get: function(id, callback) {
    var meetings = this._getMeetingsCollection();
    meetings.find({query: { _id: ObjectID(id) } } ).toArray(function(err, data) {
      if(err) {
        return callback(err);
      }
      
      return callback(null, data[0]);
    });
  },
  
  /**
  * Inserts a meeting record if the record is valid.
  * 
  * @param meeting The meeting to insert
  * @param callback The callback to invoke. Will contain the inserted document from MongoDB if success.
  */
  insert: function(meeting, callback) {
    
    this._setDefaultMeetingAttributes(meeting);
    
    if(!this._validateMeeting(meeting, callback)) {
      return;
    }
    
    var meetings = this._getMeetingsCollection();
    
    meetings.insert(meeting, function(err, result) {
  
      if(err) {
        return callback(err, null);
      }
      return callback(null, this._getInsertedDocument(result));
    }.bind(this));
  },
  
  /**
  * Saves a meeting
  * 
  * @param meeting The meeting to save
  * @param callback The callback, will get the meeting returned. 
  */
  save: function(id, meeting, callback) {
    if(!this._validateMeeting(meeting, callback)) {
      return;
    }
    
    delete meeting._id;
    
    var meetings = this._getMeetingsCollection();
  
    meetings.update({ _id: ObjectID(id)}, { $set: meeting }, function(err) {
      if(err) {
        return callback(err, null);
      }
      return callback(null, meeting);
    });
  },
  
  batchUpdateFromSource: function(meetings, callback) {
    var meetingsCollection = this._getMeetingsCollection();
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
      return callback(err, {
        inserted: inserted,
        updated: updated
      });
    });
  },
  
  /** A simple ValidationError object */
  ValidationError: function(validationResult) {
    this.validationResult = validationResult;
  },
  
  /**
   * Validates a meeting, if invalid it will call the callback with a ValidationError
   */
  _validateMeeting: function(meeting, callback) { 
    var validationResult = jsonValidator.validate(meeting, meetingSchema);
    if(!validationResult.valid) {
      callback(new this.ValidationError(validationResult), null);
      return false;
    }
    
    return true;
  },
    
  /**
   * Gets the meeting collection from MongoDB.
   */
  _getMeetingsCollection: function() {
    return mongodb.db.collection('meetings')
  },
  
  /**
   * Sets the default attributes that all new meetings must have.
   */
  _setDefaultMeetingAttributes: function(meeting) {
    meeting.created_at = new Date().getTime();
    meeting.is_deleted = false;
  },
  
  /**
   * Gets the inserted document from a mongodb insert result.
   */
  _getInsertedDocument: function(result) {
    return result.ops[0];
  }
};

module.exports = Meetings;