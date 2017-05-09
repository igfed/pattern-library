const gulp = require('gulp');
const wiredep = require('wiredep').stream;

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
        gulp.src(`app/${getProject()}/styles/*.scss`)
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)+/
            }))
            .pipe(gulp.dest('.tmp/styles'));

        gulp.src([`app/${getProject()}/**/*.html`])
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest('dist'));
    };
};
