var api = require("./api");

/**
 * Mapper that maps from a meetup event to a internal meeting.
 */
function meetupEventToMeeting(groupInformation, result) {
  return {
    title: result.name,
    organizers: [
      groupInformation.organizerName
    ],
    city: groupInformation.city,
    tags: groupInformation.tags,
    description: result.description,
    url: result.event_url,
    meetup_id: result.id,
    starts_at: result.time,
    source: {
      source_type: "meetup",
      source_id: result.id,
      data: result 
    }
  };
}

/**
 * Gets a list of internal meetings using a instance of groupInformation.
 * 
 * @param groupInformation a instance of a groupInformation object that contains the information needed for the group.
 * @param callback The callback. Will get a array of internal meeting objects.
 */
module.exports.getMeetingsFromGroup = function(groupInformation, callback) {
  api.getEvents(groupInformation.meetupUrl, function(err, data) {
    if(err) {
      callback(err);
    }
    
    // We map each item from the meetup record type to the internal record type
    var output = data.results.map(function(x) { return meetupEventToMeeting(groupInformation, x); });
    
    callback(null, output);
  });
};