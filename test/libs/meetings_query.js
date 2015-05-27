var assert = require("assert")
var meetings_query = require("../../libs/meetings_query.js")

describe('Meetings', function(){
  describe('parseQueryString', function(){
  	describe('query with all available values', function() {

	  	var query = {
	    		after: "2015-03-28",
	    		before: "2015-04-01",
	    		tags: ".NET, JavaScript",
	    		organizers: "ONUG, @condevdk",
	    		cities: "Odense, København"
	    	};

  		var result = meetings_query.parseQueryString(query);
  	    
  	    it('it should parse after', function(){
  	    	assert.equal(Date.parse("2015-03-28"), result.after);
  	    });
  
  	    it('it should parse before', function(){
  	    	assert.equal(Date.parse("2015-04-01"), result.before);
  	    });
  
  	    it('it should parse tags', function(){
  	    	assert.deepEqual([".NET", "JavaScript"], result.tags);
  	    });
  
  	    it('it should parse organizers', function(){
  	    	assert.deepEqual(["ONUG", "@condevdk"], result.organizers);
  	    });
  
  	    it('it should parse cities', function(){
  	    	assert.deepEqual(["Odense", "København"], result.cities);
  	    });
    	});

  });
  
  describe('buildMongoQuery', function() {
    
    it('should add tags to mongo query', function() {
      
      var result = meetings_query.buildMongoQuery({
          tags: ['b']
      });
      
      assert.deepEqual({"tags": {'$in': ['b']}}, result);
      
    });
      
    it('should add organizers to mongo query', function() {
      
      var result = meetings_query.buildMongoQuery({
          organizers: ['b']
      });
      
      assert.deepEqual({"organizers": {'$in': ['b']}}, result);
      
    });  
    
    it('should add cities to mongo query', function() {
      
      var result = meetings_query.buildMongoQuery({
          cities: ['b']
      });
      
      assert.deepEqual({"city": {'$in': ['b']}}, result);
      
    });
    
    it('should add starts_at filters currectly', function() {
      
      var result = meetings_query.buildMongoQuery({
          before: '2015-01-01',
          after: '2014-01-01'
      });
      
      assert.deepEqual({
        starts_at: { '$gte': '2014-01-01', '$lte': '2015-01-01' }
      }, result);
      
    });
    
  });
});