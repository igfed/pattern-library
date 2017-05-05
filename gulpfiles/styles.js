const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;

module.exports = function (params) {
    return function () {
        gulp.src(params.src)
		    .pipe($.plumber())
		    .pipe($.sourcemaps.init())
		    .pipe($.sass.sync({
		      outputStyle: 'expanded',
		      precision: 10,
		      includePaths: ['.']
		    }).on('error', $.sass.logError))
		    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		    .pipe($.sourcemaps.write())
		    .pipe(gulp.dest(params.dest))
		    .pipe(reload({ stream: true }));
    };
};