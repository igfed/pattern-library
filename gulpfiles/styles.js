const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const getProject = require('./helper/get-project');

module.exports = function (params) {
    return function () {     
    	stream = gulp.src(`app/${getProject()}/styles/*.scss`)
		    .pipe($.plumber())
		    .pipe($.sourcemaps.init())
		    .pipe($.sass.sync({
		      outputStyle: 'expanded',
		      precision: 10,
		      includePaths: ['.']
		    }).on('error', $.sass.logError))
		    .pipe($.autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'Firefox ESR'] }))
		    .pipe($.sourcemaps.write())
		    .pipe(gulp.dest('.tmp/styles'))
		    .pipe(reload({ stream: true }))
    };
};