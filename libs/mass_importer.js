var async = require('async'),
    mongodb = require('./mongodb'),
    meetup = require('./meetup/index'),
    meetings = require('./meetings'),
    meetup_groups = require('./meetup_groups');

var MassImporter = {
  'import': function(callback) {
    mongodb.init(function() {
      
      meetup_groups.list(function(err, groupList) {
        
        var operations = groupList.map(function(group) {
          return MassImporter.importGroup.bind(null, group); 
        });
      
        async.series(operations, function(err) {
          mongodb.db.close();
          
          return callback(err);
        });
      
      });
    
    });
  },
  importGroup: function(group, callback) {
    console.log("importing from " + group.meetupUrl);
    meetup.getMeetingsFromGroup(group, function(err, data) {
      if(err) {
        return callback(err);
      }
      
      meetings.batchUpdateFromSource(data, function(err, result) {
        if(err) {
          return callback(err);
        }
        
        console.log("imported " + data.length + " meetings. (Inserted " + result.inserted+ ". Updated " + result.updated + ")");
        
        return callback(null);
      });
    });
  }
};

module.exports = MassImporter;