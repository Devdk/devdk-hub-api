var request = require('supertest')
  , express = require('express')
  , config = require('../../config.js')
  , app = require('../../app.js')
  , assert = require("assert")
  , test_helper = require('../test_helper.js');
 	
describe('Meetings', function(){
  beforeEach(function(done){
  	test_helper.setupDatabase(done);
  });
  describe('GET', function(){

  	it('It should be okay', function(next) {
		request(app)
			.get('/meetings')
			.expect(200)
			.end(function(err, res){
				if (err) {
					next(err);
					return;
				} 
				next()
			});
  	});

  	it('It should return JSON', function(next) {
		request(app)
			.get('/meetings')
			.expect(200)
			.end(function(err, res){
				if (err) {
					next(err);
					return;
				} 
				next();
			});
	});

  });

  describe('POST', function() {
  	it('Should accept a valid meeting', function(next) {
		request(app)
			.post('/meetings')
			.send({
				"title": "Jespers møde!",
				"starts_at": 1407715200000,
				"description": "Jespers møde, KUN for Jesper!",
				"tags": [
					"jesper"
					],
				"organizers": [
					"Jesper"
					],
				"city": "Odense"
			})
	        .expect(201)
	      	.end(function(err, res){
				if (err) {
					next(err);
					return;
				}
				var pattern = /\/meetings\/.*/;
				assert(pattern.test(res.headers["location"]), res.headers["location"] + " does not start with /meetings/");
				next();
			});
  	});

  	it('Should reject invalid meetings', function(next) {
		request(app)
			.post('/meetings')
			.send({
				"starts_at": 1407715200000,
				"description": "Jespers møde, KUN for Jesper!",
				"tags": [
					"jesper"
					],
				"organizers": [
					"Jesper"
					],
				"city": "Odense",
			})
	        .expect(400)
	      	.end(function(err, res){
				if (err) {
					next(err);
					return;
				} 
				next();
			});
  	});

  });

});
