var MeetupClient = require('meetup-api');
var config = require('../../config');

module.exports.getEvents = function(groupUrlname, callback) {
	try {
    var client = createClient();
    var params = {
  		group_urlname: groupUrlname
  	};
    
  	client.getEvents(params, callback);
  } catch(e) {
    callback(e);
  }
};

function createClient() {
	if(!config.meetupKey) {
		throw "No MEETUP_KEY found in env.";
	}
	
	return MeetupClient({
		key: config.meetupKey
	});
}