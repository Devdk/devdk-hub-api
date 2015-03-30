var request = require('supertest')
  , express = require('express')
  , config = require('../../config.js')
  , app = require('../../app.js');
 
config.mongodbUrl = 'mongodb://localhost:27017/hub_test';

describe('Meetings', function(){

  describe('GET', function(){

  	it('It should be okay', function(next) {
		request(app)
			.get('/meetings')
			.expect(200)
			.end(function(err, res){
				if (err) throw err;
				next()
			});
  	});

  	it('It should return JSON', function(next) {
		request(app)
			.get('/meetings')
			.expect(200)
			.end(function(err, res){
				if (err) throw err;
				next()
			});
	});

  });

});
