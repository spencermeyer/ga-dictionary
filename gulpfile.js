var gulp       = require('gulp');
var gutil      = require('gulp-util');
var sass       = require('gulp-ruby-sass');
var connect    = require('gulp-connect');
var yaml       = require('gulp-yaml');
var browserify = require('browserify');
var source     = require('vinyl-source-stream');

gulp.task('connect', function () {
	connect.server({
		root: 'public',
		port: 4000
	});
});

gulp.task('browserify', function() {
	// Grabs the app.js file
	return browserify('./app/app.js')
	// bundles it and creates a file called main.js
	.bundle()
	.pipe(source('main.js'))
	// saves it the public/js/ directory
	.pipe(gulp.dest('./public/js/'));
});

gulp.task('sass', function() {
	return sass('scss/style.scss')
	.pipe(gulp.dest('public/css'));
});

gulp.task('yaml', function() {
  return gulp.src('./data/*.yml')
		// convert the yaml to json
    .pipe(yaml())
		// output to terminal
		.on('data', function(file) {
			 gutil.log('The converted file from YAML to JSON is: ' + gutil.colors.bgYellow.bold.black(file.contents));
			 gutil.log(gutil.colors.yellow('*** The file has also been written to ./output directory ****'));
		 })
		// save to the data directory
    .pipe(gulp.dest('./data/'));
});

gulp.task('watch', function() {
	gulp.watch('app/**/*.js', ['browserify']);
	gulp.watch('scss/style.scss', ['sass']);
	gulp.watch('data/*.yml', ['yaml', 'browserify']);
});

gulp.task('default', ['connect', 'watch']);
