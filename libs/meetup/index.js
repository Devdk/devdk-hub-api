var api = require("./api");

module.exports.getMeetingsFromGroup = function(groupInformation, cb) {
  api.getGroupEvents(groupInformation.meetupUrl, function(err, data) {
    if(err) {
      cb(err);
    }
    
    var output = data.results.map(function(x) { return meetupEventToMeeting(groupInformation, x); });
    
    cb(null, output);
  });
};

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
    starts_at: new Date(result.time),
    source: {
      source_type: "meetup",
      source_id: result.id,
      data: result 
    }
  };
}