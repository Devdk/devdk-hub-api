var gulp = require('gulp'),
    apidoc = require('gulp-apidocjs');

gulp.task('apidoc', function(cb){
  apidoc.exec({
    src: "routes/",
    dest: "build/docs",
  }, cb);
});

gulp.task('build', ['apidoc']);
gulp.task('heroku', ['build']);