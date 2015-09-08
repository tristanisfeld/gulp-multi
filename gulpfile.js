// -----------------------------------------------------------
// gulpfile.js
// -----------------------------------------------------------
var gulp        = require('gulp'), 
    config      = require('./gulp/config'),
    plugins     = require('gulp-load-plugins')();

// ----------------------------------------- Get Task Function
function getTask(task) {
    return require('./gulp/tasks/' + task)(gulp, plugins);
}

// --------------------------------------------- Gulp Commands
// ---- gulp
// ---- gulp watch
// ---- gulp newTask

// ------------------------------------------------ Gulp Tasks
gulp.task('browsersync', ['sass','ts'], getTask('browsersync'));
gulp.task('sass',           getTask('sass'));
gulp.task('ts',             getTask('typescript'));
gulp.task('newTask',            getTask('newTask'));

// ------------------------------------------------ Gulp watch
gulp.task('watch', ['ts', 'sass'], function() {
    gulp.watch(config.typescript.src, ['ts']);
    gulp.watch(config.sass.src, ['sass']);
});

// ----------------------------------------------- Default Dev
gulp.task('default', ['sass', 'ts', 'browsersync'], function() {
    console.log("I am running...");
});
