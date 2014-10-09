var gulp = require('gulp');

var less = require('gulp-less');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var karma = require('karma').server;

var SRC = './src/';
var BUILD = './build/';

var paths = {
  jade: SRC + '**/*.jade',
  less: [
      SRC + 'common-less/common.less',
      SRC + 'user/**/*.less'
  ],
  scripts: [
      SRC + 'undeadlifts.js',
      SRC + '**/*.js',
      '!' + SRC + 'lib/**/*.js',
      '!' + SRC + '**/*_test.js'
  ],
  lib: SRC + 'lib/**/*',
  favicon: SRC + 'favicon/**/*'
};

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// COMMON
gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest(BUILD + '/lib'))
});

gulp.task('favicon', function() {
  return gulp.src(paths.favicon)
    .pipe(gulp.dest(BUILD + '/favicon'))
});

gulp.task('jade', function() {
  return gulp.src([paths.jade, '!**/base.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(concat('undeadlifts.css'))
    .pipe(gulp.dest(BUILD));
});


gulp.task('scripts', ['lint'], function() {
  return gulp.src(paths.scripts)
    .pipe(concat('undeadlifts.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD))
});

gulp.task('build', ['lib', 'jade', 'less', 'scripts']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
//    singleRun: true
  }, done);
});