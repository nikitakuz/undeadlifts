var gulp = require('gulp');

var less = require('gulp-less');
var jade = require('gulp-jade');
var ngHtml2Js = require('gulp-ng-html2js');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var karma = require('karma').server;

var SRC = './src/';
var BUILD = './build/';
var TEMP = './temp/';

var paths = {
  jade: [SRC + '**/*.jade', '!' + SRC + '*.jade'],
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
  lib: {
    js: [
        SRC + 'lib/js/**/*'
    ],
    mp3: [
        SRC + 'lib/mp3/**/*'
    ]
  },
  favicon: SRC + 'favicon/**/*'
};

gulp.task('index', function() {
  return gulp.src(SRC + 'index.jade')
    .pipe(jade())
    .pipe(gulp.dest(BUILD));
});

gulp.task('jade2js', ['clean-jade2html']);

gulp.task('clean-jade2html', ['html2js'], function() {
  return gulp.src(TEMP, {read: false})
    .pipe(clean({force: true}))
});

gulp.task('html2js', ['jade2html'], function() {
  return gulp.src([TEMP + '**/*.html'])
    .pipe(ngHtml2Js({
      moduleName: 'undeadlifts'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('jade2html', function() {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest(TEMP));
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

gulp.task('lib', ['lib-js', 'lib-mp3']);

gulp.task('lib-js', function() {
  return gulp.src(paths.lib.js)
    .pipe(uglify())
    .pipe(rename(function(path) {
      path.extname = ".min.js";
    }))
    .pipe(gulp.dest(BUILD + '/lib/js'))
});

gulp.task('lib-mp3', function() {
  return gulp.src(paths.lib.mp3)
    .pipe(gulp.dest(BUILD + '/lib/mp3'))
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

gulp.task('build', ['index', 'lib', 'scripts', 'jade2js', 'less']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.jade, ['jade2js']);
  gulp.watch([SRC + '**/*.less'], ['less']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
//    singleRun: true
  }, done);
});