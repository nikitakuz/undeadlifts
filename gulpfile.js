var gulp = require('gulp');

var less = require('gulp-less');
var jade = require('gulp-jade');
var ngHtml2Js = require('gulp-ng-html2js');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var karma = require('karma').server;

var SRC = './src/';
var BUILD = './build/';

var paths = {
  jade: SRC + '**/*.jade',
  partials: [
      BUILD + '**/*.html',
      '!' + BUILD + '*.html',
      '!' + BUILD + 'jade-svg/**/*.html'
  ],
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


gulp.task('jade', function() {
  return gulp.src([paths.jade, '!**/base.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD));
});

gulp.task('html2js', ['jade'], function() {
  return gulp.src(paths.partials)
    .pipe(ngHtml2Js({
      moduleName: 'undeadlifts'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
    .pipe(less())
    .pipe(concat('undeadlifts.css'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest(BUILD + '/lib'))
});

gulp.task('favicon', function() {
  return gulp.src(paths.favicon)
    .pipe(gulp.dest(BUILD + '/favicon'))
});

gulp.task('scripts', ['lint'], function() {
  return gulp.src(paths.scripts)
    .pipe(concat('undeadlifts.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD))
});

gulp.task('build', ['lib', 'html2js', 'less', 'scripts']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.jade, ['html2js']);
  gulp.watch(paths.less.concat('**/*.less'), ['less']);
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
//    singleRun: true
  }, done);
});