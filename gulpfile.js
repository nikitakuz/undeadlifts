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
  templates: [SRC + '**/*.jade', '!' + SRC + '*.jade'],
  less: [
      SRC + 'common-less/common.less',
      SRC + 'user/**/*.less'
  ],
  scripts: [
      SRC + 'undeadlifts.js',
      SRC + '**/*.js',
      '!' + SRC + 'lib/**/*.js',
      '!' + SRC + '**/*_mock.js',
      '!' + SRC + '**/*_test.js'
  ],
  lib: {
    js: [
      SRC + 'lib/js/angular-sanitize-1.2.21.js',
      SRC + 'lib/js/angular-ui-router-0.2.10.js',
      SRC + 'lib/js/ui-bootstrap-typeahead-tpls-0.12.0.js',
      SRC + 'lib/js/angular-elastic-2.4.2.js',
      SRC + 'lib/js/angularfire-0.9.2.js',
      SRC + 'lib/js/howler-1.1.25.js'
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

gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(jade())
    .pipe(ngHtml2Js({
      moduleName: 'undeadlifts.templates'
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

gulp.task('lib', ['lib-js', 'lib-mp3']);

gulp.task('lib-js', function() {
  return gulp.src(paths.lib.js)
    .pipe(uglify())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest(BUILD))
});

gulp.task('lib-mp3', function() {
  return gulp.src(paths.lib.mp3)
    .pipe(gulp.dest(BUILD))
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

gulp.task('build', ['index', 'favicon', 'lib', 'scripts', 'templates', 'less']);

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch([SRC + '**/*.less'], ['less']);
});

gulp.task('test', ['build'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
//    singleRun: true
  }, done);
});