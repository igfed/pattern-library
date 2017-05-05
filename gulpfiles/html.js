const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

module.exports = function(params) {
    return function() {
        gulp.src(params.src)
            .pipe($.useref({ searchPath: params.searchPath }))
            .pipe($.if('*.js', $.uglify()))
            .pipe($.if('*.css', $.cssnano({ safe: true, autoprefixer: false })))
            .pipe($.if('*.html', $.htmlmin({ collapseWhitespace: true })))
            .pipe(gulp.dest(params.dest));
    };
};
