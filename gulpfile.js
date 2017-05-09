const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

//Tasks
const clean = require('./gulpfiles/clean');
const styles = require('./gulpfiles/styles');
const bundle = require('./gulpfiles/bundle');
const html = require('./gulpfiles/html');
const images = require('./gulpfiles/images');
const fonts = require('./gulpfiles/fonts');
const extras = require('./gulpfiles/extras');
const lint = require('./gulpfiles/lint');
const wiredep = require('./gulpfiles/wiredep');
const styleGuide = require('./gulpfiles/styleguide');
const githubPages = require('./gulpfiles/githubpages');
const serve = require('./gulpfiles/serve');

const getProject = require('./gulpfiles/helper/get-project');

gulp.task('bundle', bundle());

gulp.task('styles', styles());

gulp.task('html', ['styles', 'bundle'], html());

gulp.task('images', images());

gulp.task('clean', clean());

gulp.task('fonts', fonts());

gulp.task('extras', extras());

gulp.task('lint', lint());

gulp.task('wiredep', wiredep());

gulp.task('serve', ['clean'], () => {
	gulp.start('build', serve());
});

gulp.task('styleguide', styleGuide())

gulp.task('build', ['lint', 'styleguide', 'wiredep', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src(`${getProject()}/**/*`).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('default', ['clean'], () => {
	gulp.start('build');
});