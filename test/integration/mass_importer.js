var assert = require("assert");
var mongodb = require("../../libs/mongodb");
var mass_importer = require('../../libs/mass_importer');
var test_helper = require("../test_helper");
var config = require('../../config');
var null_logger = {
  info: function() {}
};

describe('Mass Importer', function(){

  it('should import from Meetup', function(done) {
    this.timeout(50000);
    var dwOdense = { meetupUrl: "dwodense", organizerName: "Design and Web Development Odense", city: "Odense", tags: [ "web" ] };
    mass_importer.importGroups(null_logger, config, [dwOdense], function(err) {
      if(err) {
        done(err);
        return;
      }
      
      done();
    });

  });
});