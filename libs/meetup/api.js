var MeetupClient = require('meetup-api');
var config = require('../../config');

module.exports.getEvents = function(groupUrlname, callback) {
	var client = createClient();
  
  var params = {
		group_urlname: groupUrlname
	};
  
	client.getEvents(params, callback);	
};

function createClient() {
	if(!config.meetupKey) {
		throw "No MEETUP_KEY found in env.";
	}
	
	return MeetupClient({
		key: config.meetupKey
	});
}