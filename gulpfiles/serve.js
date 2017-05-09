const gulp = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const getProject = require('./helper/get-project');

module.exports = function(params) {
    return function() {
        browserSync({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'dist'],
                routes: {
                    '/bower_components': 'bower_components'
                }
            }
        });

        gulp.watch([
            `app/${getProject()}/*.html`,
            `app/${getProject()}/images/**/*`,
            '.tmp/fonts/**/*'
        ]).on('change', reload);

        gulp.watch(`app/${getProject()}/styles/**/*.scss`, ['styleguide', 'styles']);
        gulp.watch(`app/scripts/modules/*.js`, ['bundle']);
        gulp.watch('app/ig-base/fonts/**/*', ['fonts']);
        gulp.watch('bower.json', ['wiredep', 'fonts']);
    };
};
