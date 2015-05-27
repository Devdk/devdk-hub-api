var gulp = require('gulp'),
    apidoc = require('gulp-apidocjs'),
    async = require('async'),
    meetup = require('./libs/meetup/index'),
    meetings = require('./libs/meetings'),
    mongodb = require('./libs/mongodb'),
    shell = require('gulp-shell'),
    meetup_groups = require('./libs/meetup_groups');

gulp.task('apidoc', function(cb){
  apidoc.exec({
    src: "routes/",
    dest: "build/docs",
  }, cb);
});

gulp.task('localdev', shell.task('nodemon', { env: { 'PORT': "3001" } }));

gulp.task('massimport', function(cb) {
  
  mongodb.init(function() {
      
      meetup_groups.list(function(err, groupList) {
        
        var operations = groupList.map(function(group) {
          return function(cb) {
            console.log("importing from " + group.meetupUrl);
            meetup.getMeetingsFromGroup(group, function(err, data) {
              if(err) {
                throw err;
              }
              meetings.batchUpdateFromSource(data, function(err, result) {
                if(err) {
                  throw err;
                }
                
                console.log("imported " + data.length + " meetings. (Inserted "+ result.inserted+ ". Updated "+ result.updated +")");
                
                cb(null);
              });
            });
          };
        });
      
        async.series(operations, function(err) {
          if(err) {
            throw err;
          }
          
          mongodb.db.close();
          
          cb();
        });
      
    });
    
  });
  
});


gulp.task('build', ['apidoc']);
gulp.task('heroku', ['build']);