var request = require('supertest')
  , express = require('express')
  , config = require('../../config')
  , app = require('../../app')
  , assert = require("assert")
  , test_helper = require('../test_helper');

var fixtures = {
  validMeeting: {
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
	},
  invalidMeeting: {
  	"starts_at": 1407715200000,
  	"description": "Jespers møde, KUN for Jesper!",
  	"tags": [
  		"jesper"
  		],
  	"organizers": [
  		"Jesper"
  		],
  	"city": "Odense",
  },
};

   
describe('Meetings', function(){
  
  beforeEach(function(done){
  	test_helper.setupDatabase(done);
  });

  describe('GET', function(){

  	it('It should be okay', function(next) {
  		request(app)
  			.get('/meetings')
  			.expect(200, next);
  	});

  	it('It should return JSON', function(next) {
  		request(app)
  			.get('/meetings')
  			.expect(200, next);
	 	});

  });

  describe('POST', function() {
    it('Should accept a valid meeting', function(next) {
      request(app)
			  .post('/meetings')
			  .send(fixtures.validMeeting)
	      .expect(201)
        .expect('location', /\/meetings\/.*/, next);
  	});

  	it('Should reject invalid meetings', function(next) {
      request(app)
			  .post('/meetings')
			  .send(fixtures.invalidMeeting)
	      .expect(400, next);
  	});
  });
});
