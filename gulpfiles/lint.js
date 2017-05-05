const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;

module.exports = function(params) {
    return function() {
        lint('app/scripts/modules/*.js', {
                fix: false
            })
            .pipe(gulp.dest('app/scripts/modules'));
    };

    function lint(files, options) {
        return gulp.src(files)
            .pipe(reload({ stream: true, once: true }))
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
    }
};
