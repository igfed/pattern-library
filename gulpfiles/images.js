const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
    	let imagePath = getProject() === 'ig-base' ? ['app/ig-base/images/**/*'] : [`app/${getProject()}/images/**/*`, 'app/ig-base/images/**/*'];
        let stream = gulp.src(imagePath)
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
