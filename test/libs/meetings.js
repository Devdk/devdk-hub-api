var assert = require("assert");
var meetings = require("../../libs/meetings.js");
var meetings_query = require("../../libs/meetings_query.js")
var test_helper = require("../test_helper.js");


describe('Meetings', function(){
	beforeEach(function(done){
		test_helper.clearDB(done);
	});

	describe('Find', function() {
		it('finds all', function(done) {
			meetings.find({}, function(err, items) {
				// TODO: Check stuff
				done();
			});
		});
	});
});