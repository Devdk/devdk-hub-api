var mongodb = require('../libs/mongodb.js');
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');
var meetingSchema = require('./../public/schemas/meeting_schema.json');
var JsonValidator = require('jsonschema').Validator;
var jsonValidator = new JsonValidator();
var ValidationError = function(validationResult) {
  this.validationResult = validationResult;
}

module.exports.find = function(query, cb) {
  var meetings = mongodb.db.collection('meetings');
  meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);

}

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
}

module.exports.ValidationError = ValidationError;
