var MeetupClient = require('meetup-api');
var config = require('../../config');

module.exports.getEvents = function(groupUrlname, apiKey, callback) {
	try {
    var client = createClient(apiKey);
    var params = {
  		group_urlname: groupUrlname
  	};
    
  	client.getEvents(params, callback);
  } catch(e) {
    callback(e);
  }
};

function createClient(apiKey) {
	if(!apiKey) {
		throw "apiKey was not set.";
	}
	
	return MeetupClient({
		key: apiKey
	});
}