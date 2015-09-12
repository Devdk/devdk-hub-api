var async = require('async'),
    mongodb = require('./mongodb'),
    meetup = require('./meetup/index'),
    meetings = require('./meetings'),
    meetup_groups = require('./meetup_groups');

var MassImporter = {
  'import': function(logger, config, callback) {      
      if(!config.meetupKey) {
        throw "config.meetupKey must be set.";
      }
    
      logger.info("Connected to MongoDB");
      
      meetup_groups.list(function(err, groups) {
        
        if(err) {
          return callback(err);
        }
        
        this.importGroups(logger, config, groups, callback);
        
      });
  },
  importGroups: function(logger, config, groups, callback) {
    var operations = groups.map(function(group) {
      return MassImporter.importGroup.bind(null, logger, config, group); 
    });
  
    async.series(operations, function(err) {
      if(err) {
        return callback(err);
      }
      
      return callback(err);
    });
  },
  importGroup: function(logger, config, group, callback) {
    logger.info("importing from " + group.meetupUrl);
    meetup.getMeetingsFromGroup(group, config.meetupKey, function(err, data) {
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

module.exports = MassImporter;