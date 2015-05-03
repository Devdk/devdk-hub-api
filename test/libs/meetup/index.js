var proxyquire =  require('proxyquire');
var assert = require("assert");
var fs = require("fs");
var meetup = proxyquire("../../../libs/meetup/index", {
  "./api": {
    getGroupEvents: function(groupname, cb) {
      fs.readFile(__dirname + '/../../data/meetup_getGroupEvents.json', 'utf8', function (err, data) {
        if (err) throw err;
        cb(null, JSON.parse(data));
      });
    }
  }
});

var groupInformation = {
  meetupUrl: "dwodense",
  organizerName: "Design and Web Development Odense",
  city: "Odense"
};

describe('Meetup', function(){
  
	it('should convert meetup meetings to hub formatted meetings', function(done){
    meetup.getMeetingsFromGroup(groupInformation, function(err, meetings) {
      assert.equal(meetings.length, 12);
      var meeting = meetings[0];
      
      assert.equal(meeting.title, "Månedligt DWOdense meetup");
      assert.equal(meeting.organizers[0], groupInformation.organizerName);
      assert.equal(meeting.city, groupInformation.city);
      assert(meeting.description != null);
      assert.equal(meeting.url, "http://www.meetup.com/dwodense/events/219578700/");
      assert.equal(meeting.starts_at, "Tue May 12 2015 19:00:00 GMT+0200 (CEST)");
      assert.equal("meetup", meeting.source.source_type);
      assert(meeting.source.data != null);
      
      done();
    });
	});
  
});