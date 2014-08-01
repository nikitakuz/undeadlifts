var gulp = require('gulp');

var less = require('gulp-less');
var jade = require('gulp-jade');

var SRC = './src/';
var BUILD = './build/';

var paths = {
    less: SRC + 'less/*.less',
    jade: SRC + 'jade/**/*.jade'
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

gulp.task('watch', ['jade', 'less'], function() {
    gulp.watch('**/*.less', ['less']);
    gulp.watch(paths.jade, ['jade']);
});