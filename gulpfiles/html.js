const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
        let stream = gulp.src(`app/${getProject()}/*.html`)
            .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
            .pipe($.if('*.js', $.uglify()))
            .pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
            .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
            .pipe(gulp.dest('dist'));
        return stream;
    };
};
