const gulp = require('gulp');
const wiredep = require('wiredep').stream;

module.exports = function(params) {
    return function() {
        gulp.src(params.cssSrc)
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)+/
            }))
            .pipe(gulp.dest(params.cssDest));

        gulp.src([params.htmlSrc])
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest(params.htmlDest));
    };
};
