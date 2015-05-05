var MeetupClient = require('meetup-api');
var config = require('../../config.js');

module.exports.getGroupEvents = function(groupUrlname, cb) {
	var client = createClient();
	client.getEvents({
		group_urlname: groupUrlname
	}, function(error, events) {
		if (error) {
			cb(error, null);
		} else {
			cb(null, events);
		}
	});	
};

function createClient() {
	if(!process.env.MEETUP_KEY) {
		throw "No MEETUP_KEY found in env.";
	}
	
	return MeetupClient({
		key: config.meetupKey
	});
}