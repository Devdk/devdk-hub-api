var api = require("./api");

module.exports.getMeetingsFromGroup = function(groupName, cb) {
  api.getGroupEvents(groupName, function(err, data) {
    if(err) {
      cb(err);
    }
    
    var output = [];
    
    data.results.forEach(function(result) {
      output.push({
        title: result.name,
        description: result.description,
        url: result.event_url,
        meetup_id: result.id,
        starts_at: new Date(result.time),
        source: {
          source_type: "meetup",
          data: result 
        }
      });
    });
    
    cb(null, output);
  });
};