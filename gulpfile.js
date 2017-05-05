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


//Generic Tasks
gulp.task('bundle', bundle());

//IG.com Tasks
gulp.task('igc-styles', styles({
	'src': 'app/ig-com/styles/*.scss',
	'dest': '.tmp/ig-com/styles'
}));

gulp.task('igc-html', ['igc-styles', 'bundle'], html({
	'src': 'app/ig-com/*.html',
	'dest': 'dist/ig-com',
	'searchPath': ['.tmp', 'app', '.']
}));

gulp.task('igc-images', images({
	'src': 'app/ig-com/images/**/*',
	'dest': 'dist/ig-com/images'
}));

gulp.task('igc-clean', clean({
	'dest': 'dist/ig-com'
}));

gulp.task('igc-fonts', fonts({
	'tmp': '.tmp/ig-com/fonts',
	'dest': 'dist/ig-com/fonts'
}));

gulp.task('igc-extras', extras({
	'src': 'app/ig-com',
	'dest': 'dist/ig-com'
}));

gulp.task('igc-lint', lint());

gulp.task('igc-wiredep', wiredep({
	'cssSrc': 'app/ig-com/styles/*.scss',
	'cssDest': 'app/ig-com/styles',
	'htmlSrc': 'app/ig-com/**/*.html',
	'htmlDest': 'app/ig-com'
}));

gulp.task('igc-styleguide', styleGuide({
	'src': 'app/ig-com/styles/**/*.scss',
	'templateDirectory': 'app/templates',
	'overview': 'app/templates/content/homepage.md',
	'dest': 'app'
}));

//IGC Build
gulp.task('igc-build', ['igc-lint', 'igc-wiredep', 'igc-styleguide', 'igc-html', 'igc-images', 'igc-fonts', 'igc-extras'], () => {
  return gulp.src('dist/ig-com/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('githubpages', githubPages({
	'src': 'dist/**/*',
	'docs': 'docs/ig-com'
}));

gulp.task('default', ['igc-clean'], function(){
	gulp.start('igc-build');
});

//IG-Client Portal Tasks