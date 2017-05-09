const gulp = require('gulp');
const del = require('del');

module.exports = function (params) {
    return function () {
       gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
    };
};