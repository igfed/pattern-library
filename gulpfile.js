const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const argv = require('yargs').argv;

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

const projConfig = {
	'igc' : 'ig-com',
	'igcp' : 'ig-cp'
};

function getProj() {
	//If project is not used, revert to default
	return `${projConfig[argv.proj] ? projConfig[argv.proj] : projConfig['igc']}`
}

gulp.task('bundle', bundle());

gulp.task('styles', styles({
	'src': `app/${getProj()}/styles/*.scss`
}));

gulp.task('html', ['styles', 'bundle'], html({
	'src': `app/${getProj()}/*.html`
}));

gulp.task('images', images({
	'src': `app/${getProj()}/images/**/*`
}));

gulp.task('clean', clean());

gulp.task('fonts', fonts());

gulp.task('extras', extras({
	'src': `app/${getProj()}`
}));

gulp.task('lint', lint());

gulp.task('wiredep', wiredep({
	'cssSrc': `app/${getProj()}/styles/*.scss`,
	'htmlSrc': `app/${getProj()}/**/*.html`
}));

gulp.task('serve', ['build'], serve({
	'projPath' : getProj() 
}));

gulp.task('build', ['lint', 'wiredep', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

// gulp.task('doc-styles', styles({
// 	'src': 'app/base/styles/*.scss',
// 	'dest': 'docs/styles'
// }));



// gulp.task('doc-styleguide', styleGuide({
// 	'src': `app/base/styles/**/*.scss`
// }));

// gulp.task('doc-wiredep', wiredep({
// 	'cssSrc': 'app/base/styles/*.scss',
// 	'cssDest': 'app/base/styles',
// 	'htmlSrc': 'app/docs/**/*.html',
// 	'htmlDest': 'docs'
// }));

// gulp.task('githubpages', ['doc-wiredep', 'doc-styleguide', 'doc-styles']);

gulp.task('default', ['clean'], function(){
	gulp.start('build');
});