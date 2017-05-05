const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

module.exports = function(params) {
    return function() {
        gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
            .concat('app/base/fonts/**/*'))
            .pipe(gulp.dest(params.tmp))
            .pipe(gulp.dest(params.dest));
    };
};
