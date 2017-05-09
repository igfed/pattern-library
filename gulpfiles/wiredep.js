const gulp = require('gulp');
const wiredep = require('wiredep').stream;

module.exports = function(params) {
    return function() {
        let stream = gulp.src(params.cssSrc)
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)+/
            }))
            .pipe(gulp.dest(`${params.cssDest ? params.cssDest : '.tmp/styles'}`));

        gulp.src([params.htmlSrc])
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest(`${params.htmlDest ? params.htmlDest : 'dist'}`));

      	return stream;
    };
};
