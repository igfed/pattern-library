const gulp = require('gulp');

module.exports = function(params) {
    return function() {
    	let stream = gulp.src([
            `$(params.src)*.*`,
            `!$(params.src)*.html`
        ], {
            dot: true
        }).pipe(gulp.dest('dist'));
    	return stream;
    };
};