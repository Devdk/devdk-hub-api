var gulp = require('gulp'),
    apidoc = require('gulp-apidocjs'),
    async = require('async'),
    meetup = require('./libs/meetup/index'),
    meetings = require('./libs/meetings'),
    mongodb = require('./libs/mongodb'),
    shell = require('gulp-shell'),
    meetup_groups = require('./libs/meetup_groups'),
    mass_importer = require('./libs/mass_importer');

gulp.task('apidoc', function(cb){
  apidoc.exec({
    src: "routes/",
    dest: "build/docs",
  }, cb);
});

gulp.task('localdev', shell.task('nodemon', { env: { 'PORT': "3001" } }));

gulp.task('massimport', mass_importer.import);

gulp.task('build', ['apidoc']);
gulp.task('heroku', ['build']);