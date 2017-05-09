const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

module.exports = function(params) {
    return function() {
        let stream = gulp.src([params.src, 'app/base/images/**/*'])
            .pipe($.cache($.imagemin({
                progressive: true,
                interlaced: true,
                // don't remove IDs from SVGs, they are often used
                // as hooks for embedding and styling
                svgoPlugins: [{ cleanupIDs: false }]
            })))
            .pipe(gulp.dest('dist/images'));

        return stream;
    };
};
