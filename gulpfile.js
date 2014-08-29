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
  app: [SRC + 'js/cleanlifts/**/*.js'],
  login: [SRC + 'js/login.js'],
  signup: [SRC + 'js/signup.js'],
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

gulp.task('app', ['lint'], function() {
    return gulp.src(paths.app)
      .pipe(concat('cleanlifts.js'))
//      .pipe(uglify())
      .pipe(gulp.dest(BUILD + 'js'))
});

gulp.task('login', ['lint'], function() {
  return gulp.src(paths.login)
    .pipe(concat('login.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD + 'js'))
});

gulp.task('signup', ['lint'], function() {
  return gulp.src(paths.signup)
    .pipe(concat('signup.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD + 'js'))
});

gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(uglify())
    .pipe(gulp.dest(BUILD + 'js/lib'))
});

gulp.task('watch', ['jade', 'less', 'app', 'login', 'signup', 'lib'], function() {
  gulp.watch('**/*.less', ['less']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.app, ['app']);
  gulp.watch(paths.login, ['login']);
  gulp.watch(paths.signup, ['signup']);
});