const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const del = require('del');
const kss = require('gulp-kss');


module.exports = function (params) {
    return function () {
        del.bind(null, [params.docs])
  		return gulp.src([params.src], {}).pipe(gulp.dest(params.docs));
    };
};