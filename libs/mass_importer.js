var async = require('async'),
    mongodb = require('./mongodb'),
    meetup = require('./meetup/index'),
    meetings = require('./meetings'),
    meetup_groups = require('./meetup_groups');

var MassImporter = {
  'import': function(logger, callback) {      
      logger.info("Connected to MongoDB");
      
      meetup_groups.list(function(err, groupList) {
        
        if(err) {
          return callback(err);
        }
        
        var operations = groupList.map(function(group) {
          return MassImporter.importGroup.bind(null, logger, group); 
        });
      
        async.series(operations, function(err) {
          if(err) {
            return callback(err);
          }
          
          return callback(err);
        });
      
      });
  },
  importGroup: function(logger, group, callback) {
    logger.info("importing from " + group.meetupUrl);
    meetup.getMeetingsFromGroup(group, function(err, data) {
      if(err) {
        return callback(err);
      }
      
      meetings.batchUpdateFromSource(data, function(err, result) {
        if(err) {
          return callback(err);
        }
        
        logger.info("imported " + data.length + " meetings. (Inserted " + result.inserted+ ". Updated " + result.updated + ")");
        
        return callback(null);
      });
    });
  }
};

MassImporter.closeMongo = true;

module.exports = MassImporter;