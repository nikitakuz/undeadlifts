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
  less: SRC + 'less/*.less',
  jade: SRC + 'jade/**/*.jade',
  scripts: [SRC + 'js/**/*.js', '!' + SRC + 'js/lib/**/*.js'],
  app: [SRC + 'js/cleanlifts/**/*.js'],
  lib: SRC + 'lib/**/*',
  favicon: SRC + 'favicon/**/*',
  common: {
    less: SRC + 'common-less/common.less'
  },
  login: {
    jade: SRC + 'login/**/*.jade',
    js: SRC + 'login/**/*.js'
  },
  signup: {
    jade: SRC + 'signup/**/*.jade',
    js: SRC + 'signup/**/*.js'
  },
  user: {
    jade: SRC + 'user/**/*.jade',
    js: [SRC + 'user/user.js', SRC + 'user/**/*.js'],
    less: [SRC + 'user/**/*.less']
  }
};

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

// COMMON
gulp.task('lib', function() {
  return gulp.src(paths.lib)
    .pipe(gulp.dest(BUILD + '/lib'))
});

gulp.task('favicon', function() {
  return gulp.src(paths.favicon)
    .pipe(gulp.dest(BUILD + '/favicon'))
});

gulp.task('index-jade', function() {
  return gulp.src([SRC + '/index.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD));
});

gulp.task('common-less', function() {
  return gulp.src(paths.common.less)
    .pipe(less())
    .pipe(concat('common.css'))
    .pipe(gulp.dest(BUILD));
});


// LOGIN MODULE

gulp.task('login', ['login-jade', 'login-js']);

gulp.task('login-jade', function(cb) {
  return gulp.src([paths.login.jade, '!**/base.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD + '/login'));
});

gulp.task('login-js', ['lint'], function() {
  return gulp.src(paths.login.js)
    .pipe(concat('login.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD + '/login'))
});


// SIGNUP MODULE

gulp.task('signup', ['signup-jade', 'signup-js']);

gulp.task('signup-jade', function(cb) {
  return gulp.src([paths.signup.jade, '!**/base.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD + '/signup'));
});

gulp.task('signup-js', ['lint'], function() {
  return gulp.src(paths.signup.js)
    .pipe(concat('signup.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD + '/signup'))
});

// USER MODULE

gulp.task('user', ['user-jade', 'user-js', 'user-less']);

gulp.task('user-jade', function(cb) {
  return gulp.src([paths.user.jade, '!**/base.jade'])
    .pipe(jade())
    .pipe(gulp.dest(BUILD + '/user'));
});

gulp.task('user-js', ['lint'], function() {
  return gulp.src(paths.user.js)
    .pipe(concat('user.js'))
//      .pipe(uglify())
    .pipe(gulp.dest(BUILD + '/user'))
});

gulp.task('user-less', function() {
  return gulp.src(paths.user.less)
    .pipe(less())
    .pipe(concat('user.css'))
    .pipe(gulp.dest(BUILD + '/user'));
});

gulp.task('build', ['lib', 'index-jade', 'common-less', 'login', 'signup', 'user']);

gulp.task('watch', ['build'], function() {
  gulp.watch(SRC + 'common-less/**/*.less', ['common-less']);
  gulp.watch(paths.login.jade, ['login-jade']);
  gulp.watch(paths.login.js, ['login-js']);
  gulp.watch(paths.signup.jade, ['signup-jade']);
  gulp.watch(paths.signup.js, ['signup-js']);
  gulp.watch(paths.user.jade, ['user-jade']);
  gulp.watch(paths.user.js, ['user-js']);
  gulp.watch(paths.user.less, ['user-less']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});