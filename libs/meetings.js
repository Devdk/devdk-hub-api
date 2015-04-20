var mongodb = require('../libs/mongodb.js');
var config = require('../config.js');
var meeting_query = require('../libs/meetings_query.js');
var JsonValidator = require('jsonschema').Validator;
var jsonValidator = new JsonValidator();

var meetingsSchema = {
  "title": "Meeting",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "starts_at": {
      "type": "number"
    },
    "city": {
      "type": "string"
    },
    "tags": {
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    "organizers": {
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },     

  },
  "required": ["title", "description", "starts_at", "city"]
};

var ValidationError = function(validationResult) {
  this.validationResult = validationResult;
}

module.exports.find = function(query, cb) {
  var meetings = mongodb.db.collection('meetings');
  meetings.find({query: query, $orderby: { starts_at : 1 } } ).toArray(cb);

}

module.exports.insert = function(meeting, cb) {

  meeting.created_at = new Date().getTime();
  var validationResult = jsonValidator.validate(meeting, meetingsSchema);
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
