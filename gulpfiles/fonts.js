const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

module.exports = function(params) {
    return function() {
        let stream = gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
            .concat('app/ig-base/fonts/**/*'))
            .pipe(gulp.dest('.tmp/fonts'))
            .pipe(gulp.dest('dist/fonts'));
        return stream;
    };
};
