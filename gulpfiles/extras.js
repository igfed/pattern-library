const gulp = require('gulp');

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
    	let stream = gulp.src([
            `app/${getProject()}*.*`,
            `!$app/${getProject()}*.html`
        ], {
            dot: true
        }).pipe(gulp.dest('dist'));
    	return stream;
    };
};