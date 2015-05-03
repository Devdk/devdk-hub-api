var gulp = require('gulp'),
    apidoc = require('gulp-apidocjs'),
    async = require('async'),
    meetup = require('./libs/meetup/index'),
    meetings = require('./libs/meetings'),
    mongodb = require('./libs/mongodb.js');

gulp.task('apidoc', function(cb){
  apidoc.exec({
    src: "routes/",
    dest: "build/docs",
  }, cb);
});

gulp.task('massimport', function(cb) {
  
  mongodb.init(function() {
    
    var groups = [
      { meetupUrl: "dwodense", organizerName: "Design and Web Development Odense", city: "Odense", tags: [ "web" ] },
      { meetupUrl: "Odense-NET-User-Group", organizerName: "Odense .NET User Group", city: "Odense", tags: [ ".net" ] },
      { meetupUrl: "umbracodk", organizerName: "Umbraco DK", city: "Odense", tags: [ ".net", "umbraco" ] },
      { meetupUrl: "Copenhagen-Node-js-Hackathon", organizerName: "Copenhagen Node.js Hackathon", city: "København", tags: [ "JavaScript", "node" ] },
      { meetupUrl: "Copenhagen-Domain-Driven-Design-Meetup", organizerName: "Copenhagen Domain Driven Design Meetup", city: "København", tags: [ "Arkitektur", "DDD" ] },
      { meetupUrl: "Azure-Usergroup-Denmark", organizerName: "Azure Usergroup Denmark", city: "København", tags: [ "web", "Azure", ".net" ] },
      { meetupUrl: "Copenhagen-Laravel-Meetup", organizerName: "Copenhagen Laravel Meetup", city: "København", tags: [ "web", "PHP", "Laravel" ] },
      { meetupUrl: "Xamarin-Developers-in-Denmark", organizerName: "Xamarin Developers in Denmark", city: "København", tags: [ ".net", "Xamarin", "iOS", "Andriod", "Windows Phone" ] },
      { meetupUrl: "Docker-Copenhagen", organizerName: "Docker Copenhagen", city: "København", tags: [ "docker" ] },
      { meetupUrl: "Windows-Developers-in-Denmark", organizerName: "Windows Developers in Denmark", city: "København", tags: [ ".net", "Windows" ] },
      { meetupUrl: "Danish-Sitecore-Developer-Group", organizerName: "Danish Sitecore Developer Group", city: "København", tags: [ ".net", "SiteCore" ] },
      { meetupUrl: "designdk", organizerName: "designdk", city: "København", tags: [ "design" ] },
      { meetupUrl: "Umbraco", organizerName: "Umbraco", city: "København", tags: [ ".net", "web", "Umbraco" ] },
      { meetupUrl: "Copenhagen-Xamarin-Developers", organizerName: "Copenhagen Xamarin Developers", city: "København", tags: [ ".net", "Xamarin", "iOS", "Andriod", "Windows Phone" ] },
      { meetupUrl: "Copenhagen-Net-User-Group", organizerName: "Copenhagen .NET User Group", city: "København", tags: [ ".net" ] },
      { meetupUrl: "GOTO-Nights-Meetup", organizerName: "GOTO Nights Meetup", city: "København", tags: [ ] },
      { meetupUrl: "Copenhagen-Frontenders", organizerName: "Copenhagen Frontenders", city: "København", tags: [ "design", "frontend" ] },
      { meetupUrl: "WordPress-Copenhagen", organizerName: "WordPress Copenhagen", city: "København", tags: [ "web", "php", "WordPress" ] },
      { meetupUrl: "The-Copenhagen-Django-Meetup-Group", organizerName: "The Copenhagen Django Meetup Group", city: "København", tags: [ "web", "python", "django" ] },
      { meetupUrl: "Meteor-Copenhagen", organizerName: "Meteor Copenhagen", city: "København", tags: [ "web", "JavaScript", "Meteor" ] },
      { meetupUrl: "Copenhagen-React-Meetup", organizerName: "Copenhagen React Meetup", city: "København", tags: [ "web", "JavaScript", "ReactJS" ] },
      { meetupUrl: "copenhagenphp", organizerName: "The Copenhagen PHP Meetup Group", city: "København", tags: [ "web", "PHP" ] },
      { meetupUrl: "code-u", organizerName: "Continuous Delivery Users - CoDe:U", city: "København", tags: [ "Continuous Delivery" ] },
      { meetupUrl: "Copenhagen-Clojure-Meetup", organizerName: "Copenhagen Clojure", city: "København", tags: [ "clojure" ] },
      { meetupUrl: "CphSpark", organizerName: "Copenhagen Apache Spark User Group", city: "København", tags: [ "spark" ] },
      { meetupUrl: "MoedegruppeFunktionelleKoebenhavnere", organizerName: "ƒunktionelle Københavnere", city: "København", tags: [ "F#", "Haskell" ] },
      { meetupUrl: "CopenhagenR-useR-Group", organizerName: "CopenhagenR - useR Group", city: "København", tags: [ "R" ] },
      { meetupUrl: "Copenhagen-tshack", organizerName: "Copenhagen #tshack", city: "København", tags: [ "hackaton" ] },
      { meetupUrl: "Sketch-App-Meetup-Copenhagen", organizerName: "Sketch App Meetup Copenhagen", city: "København", tags: [ "design", "Sketch" ] },
      { meetupUrl: "Copenhagen-AWS-User-Group", organizerName: "Danish AWS User Group", city: "København", tags: [ "AWS", "Amazon" ] },
      { meetupUrl: "CopenhagenCocoa", organizerName: "Copenhagen Cocoa", city: "København", tags: [ "iOS", "Cocoa" ] },
      { meetupUrl: "CleanwebDK", organizerName: "Cleanweb DK", city: "København", tags: [ ] },
      { meetupUrl: "Elasticsearch-Copenhagen-Meetup", organizerName: "Elasticsearch Copenhagen Meetup", city: "København", tags: [ "Elasticsearch" ] },
      { meetupUrl: "Copenhagen-Graph-Databases-Meetup", organizerName: "Copenhagen Graph Databases Meetup", city: "København", tags: [ "Neo4j" ] },
      { meetupUrl: "WordPress-Arhus", organizerName: "WordPress Arhus", city: "Aarhus", tags: [ "web", "php", "WordPress" ] },
      { meetupUrl: "Rhus-useR-group", organizerName: "Rhus useR group", city: "Aarhus", tags: [ "R" ] },
      { meetupUrl: "aarhusrb", organizerName: "aarhus.rb", city: "Aarhus", tags: [ "Ruby" ] },
      { meetupUrl: "Big-Data-Denmark", organizerName: "Big Data Denmark", city: "Aarhus", tags: [ "Big Data" ] },
      { meetupUrl: "Aarhus-Python-Django-Meetup", organizerName: "Aarhus Python/Django Meetup", city: "Aarhus", tags: [ "Python", "Django" ] },
    ];
    
    var operations = groups.map(function(group) {
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


gulp.task('build', ['apidoc']);
gulp.task('heroku', ['build']);