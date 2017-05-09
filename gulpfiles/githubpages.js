const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const del = require('del');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const kss = require('gulp-kss');

module.exports = function (params) {
    return function () {
        del.bind(null, ['docs'])
        //let stream = gulp.src('app/docs')
        	//.pipe
  		//return gulp.src([params.src], {}).pipe(gulp.dest(params.docs));
  		let stream = gulp.src(['app/ig-base/styles/**/*.scss'])
            .pipe($.plumber())
            .pipe(kss({
                templateDirectory: 'app/docs/templates',
                overview: 'app/docs/templates/content/homepage.md'
            }))
            .pipe(gulp.dest('docs'))
            .pipe(reload({ stream: true }))
            .emit('end');
       	return stream;
    };
};