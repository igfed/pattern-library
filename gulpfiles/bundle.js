const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');

module.exports = function(params={}) {
    return function() {
        rollup('rollup.config.js')
            .pipe(source('main.js'))
            .pipe(gulp.dest('app/scripts'))
            .pipe(gulp.dest('.tmp/scripts'))
    }
};
