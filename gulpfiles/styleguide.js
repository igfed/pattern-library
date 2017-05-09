const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const kss = require('gulp-kss');

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
        let stream = gulp.src([`app/${getProject()}/styles/**/*.scss`])
            .pipe($.plumber())
            .pipe(kss({
                templateDirectory: `app/${getProject()}/templates`,
                overview: `app/${getProject()}/templates/content/homepage.md`
            }))
            .pipe(gulp.dest('dist'))
            .pipe(reload({ stream: true }))
            .emit('end');
       	return stream;
    };
};
