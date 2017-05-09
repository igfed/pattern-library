const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const kss = require('gulp-kss');

module.exports = function(params) {
    return function() {
        let stream = gulp.src([params.src])
            .pipe($.plumber())
            .pipe(kss({
                templateDirectory: 'app/docs/templates',
                overview: 'app/docs/templates/content/homepage.md'
            }))
            .pipe(gulp.dest('docs'))
            .pipe(reload({ stream: true }))
            .emit('end');
       	return stream;
    };
};
