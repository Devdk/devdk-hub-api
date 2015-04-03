var assert = require("assert");
var meetings = require("../../libs/meetings.js");
var meetings_query = require("../../libs/meetings_query.js")
var test_helper = require("../test_helper.js");
var mongodb = require("../../libs/mongodb.js");

describe('Meetings', function(){
	beforeEach(function(done){
		test_helper.setupDatabase(done);
	});

	describe('Find', function() {
		it('sorts currectly', function(done) {

			var first = {
				starts_at: Date.parse("2015/01/01")
			};
			var secound = {
				starts_at: Date.parse("2014/01/01")
			};

			insert([first, secound], function(err) {
				meetings.find({}, function(err, items) {
					assert.equal(secound.starts_at, items[0].starts_at);
					done();
				});				
			})

		});
	});
});

function insert(meetings, cb) {
	var db = mongodb.db;
	var collection = db.collection("meetings");

	collection.insert(meetings, function(err) {
		cb(err);
	});
}
