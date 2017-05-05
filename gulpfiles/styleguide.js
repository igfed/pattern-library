const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const kss = require('gulp-kss');

module.exports = function(params) {
    return function() {
        gulp.src([params.src])
            .pipe($.plumber())
            .pipe(kss({
                templateDirectory: params.templateDirectory,
                overview: params.overview
            }))
            .pipe(gulp.dest(params.dest))
            .pipe(reload({ stream: true }))
            .emit('end');
    };
};
