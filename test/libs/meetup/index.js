var proxyquire =  require('proxyquire');
var assert = require("assert");
var meetup = proxyquire("../../../libs/meetup/index", {
  "./api": require("./api_mock")
});

var groupInformation = {
  meetupUrl: "dwodense",
  organizerName: "Design and Web Development Odense",
  city: "Odense"
};

describe('Meetup', function(){
  
	it('should convert meetup meetings to hub formatted meetings', function(done){
    meetup.getMeetingsFromGroup(groupInformation, "somekey", function(err, meetings) {
      assert.equal(meetings.length, 12);
      var meeting = meetings[0];
      
      assert.equal(meeting.title, "Månedligt DWOdense meetup");
      assert.equal(meeting.organizers[0], groupInformation.organizerName);
      assert.equal(meeting.tags, groupInformation.tags);
      assert.equal(meeting.city, groupInformation.city);
      assert(meeting.description != null);
      assert.equal(meeting.url, "http://www.meetup.com/dwodense/events/219578700/");
      assert.equal(meeting.starts_at, 1431450000000);
      assert.equal("meetup", meeting.source.source_type);
      assert(meeting.source.data != null);
      
      done();
    });
	});
  
});