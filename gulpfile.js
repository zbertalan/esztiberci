const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
const http = require('http');

const gulp = require('gulp');
const gutil = require('gulp-util');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const order = require('gulp-order');

const jsSources = ['js/*.js'];
const outputDir = 'dist';


// Define the 'js' task for Gulp 4
function jsTask() {
    return gulp.src(jsSources)
        .pipe(order([
            'js/jquery.min.js',
            'js/jquery.easing.1.3.js',
            'js/bootstrap.min.js',
            'js/jquery.waypoints.min.js',
            'js/sticky.js',
            'js/jquery.stellar.min.js',
            'js/hoverIntent.js',
            'js/superfish.js',
            'js/jquery.magnific-popup.min.js',
            'js/magnific-popup-options.js',
            'js/main.js'
        ], {base: './'}))
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(outputDir))
        .pipe(uglify({mangle: false}).on('error', function(err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
            this.emit('end');
        }))
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
}

gulp.task('http-server', function(){
    var app = express();
    app.use(compression())
    app.use(serveStatic('./', {
        'extensions': ['html'],
        'maxAge': 3600000
    }))
    var httpServer = http.createServer(app);
    httpServer.listen(8888);
    console.log("http://localhost:8888")
})

// Use 'exports' to make the task available to Gulp
exports.js = jsTask;

// Define the default task in Gulp 4
exports.default = gulp.series(jsTask);
// If you had multiple tasks to run in sequence, you would use gulp.series like so:
// exports.default = gulp.series(jsTask, anotherTask, yetAnotherTask);
// For parallel execution, you would use gulp.parallel like so:
// exports.default = gulp.parallel(jsTask, anotherTask, yetAnotherTask);
