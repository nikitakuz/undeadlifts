var gulp = require('gulp');

var less = require('gulp-less');
var jade = require('gulp-jade');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var SRC = './src/';
var BUILD = './build/';

var paths = {
  less: SRC + 'less/*.less',
  jade: SRC + 'jade/**/*.jade',
  scripts: [SRC + 'js/**/*.js', '!' + SRC + 'js/lib/**/*.js'],
  lib: SRC + 'js/lib/**/*.js'
};

gulp.task('less', function(cb) {
    return gulp.src(paths.less)
      .pipe(less())
      .pipe(gulp.dest(BUILD + 'css'));
});

gulp.task('jade', function(cb) {
    return gulp.src([paths.jade, '!**/base.jade'])
      .pipe(jade())
      .pipe(gulp.dest(BUILD));
});

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function() {
    return gulp.src(paths.scripts)
      .pipe(concat('cleanlifts.js'))
//      .pipe(uglify())
      .pipe(gulp.dest(BUILD + 'js'))
});

gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(uglify())
    .pipe(gulp.dest(BUILD + 'js/lib'))
});

gulp.task('watch', ['jade', 'less', 'scripts', 'lib'], function() {
    gulp.watch('**/*.less', ['less']);
    gulp.watch(paths.jade, ['jade']);
    gulp.watch(paths.scripts, ['scripts']);
});