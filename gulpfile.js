var browserify     = require('browserify');
var source         = require('vinyl-source-stream');
var mainBowerFiles = require('main-bower-files');
var gulp           = require('gulp');
var gutil          = require('gulp-util');
var sass           = require('gulp-sass');
var connect        = require('gulp-connect');
var yaml           = require('gulp-yaml');
var flatten        = require('gulp-flatten');
var gulpFilter     = require('gulp-filter');
var uglify         = require('gulp-uglify');
var minifycss      = require('gulp-minify-css');
var rename         = require('gulp-rename');
var autoprefixer   = require('gulp-autoprefixer');
var concat         = require('gulp-concat');
var bower          = require('gulp-bower');

gulp.task('serve:development', function() {
	connect.server({
		root: 'public',
		port: process.env.PORT || 4000,
		livereload: true
	});
});

gulp.task('serve:production', function() {
  connect.server({
    		root: 'public',
    port: process.env.PORT || 4000,
    livereload: false
  });
});

// Running the bower command to install components
gulp.task('bower:install', function() {
  return bower()
	.pipe(gulp.dest('./bower_components'));
});

// Moving bower fonts to public/fonts
gulp.task('bower:fonts', function(){
	return gulp.src(['bower_components/**/*.{otf,eot,svg,ttf,woff,woff2}'])
	// Prevent a nested folder structure
	.pipe(flatten())
  .pipe(gulp.dest('public/fonts/'));
});

// Moving bower js files to assets/js
gulp.task('bower:js', function(){
	var jsFilter   = gulpFilter('*.js', { restore: true });
  // mainFiles can be overridden here or bower.json with "overrides":
	var mainFiles = mainBowerFiles();

	return gulp.src(mainFiles)
	// js mainFiles are not meant to be minified
  .pipe(jsFilter)
	// minify the file again using uglify
  .pipe(uglify())
	// Rename with .min
  .pipe(rename({
    suffix: ".min"
  }))
	// Save to js/vendor
  .pipe(gulp.dest('./assets/js/vendor/'));
});

// Grouping bower related tasks
gulp.task('bower', ['bower:fonts', 'bower:js']);

gulp.task('browserify', function() {
	// Grabs the app.js file
	return browserify('./app/app.js')
	// bundles it
	.bundle()
	// and creates a file called main.js
	.pipe(source('main.js'))
	// saves it the assets/js/ directory
	.pipe(gulp.dest('./assets/js/'));
});

gulp.task("sass", function(){
	gutil.log(gutil.colors.red("Generate CSS files " + (new Date()).toString()));

	// Load the style.scss file, any files should be @imported in this file
	return gulp.src('./assets/scss/style.scss')
    .pipe(sass({
      includePaths: [
				'./bower_components/bootstrap/scss',
				'./bower_components/font-awesome/scss'
			],
			errLogToConsole: true
    }))
	  // Add auto-prefixes
		.pipe(autoprefixer("last 3 version"))
		// Export expanded version
		.pipe(gulp.dest("./public/css"))
		// Minify and rename
		.pipe(minifycss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('yaml', function(){
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

gulp.task('jsconcat', function(){
	return gulp.src([
		'./assets/js/vendor/jquery.min.js',
		'./assets/js/vendor/bootstrap.min.js',
		'./assets/js/vendor/*.js',
		'./assets/js/main.js',
		'./assets/js/*.js',
	])
  .pipe(concat('app.js'))
	.pipe(gulp.dest('./public/js/'))
  .pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
	gulp.watch('app/**/*.js', ['browserify']);
	gulp.watch('assets/js/**/*.js', ['jsconcat']);
	gulp.watch('assets/scss/style.scss', ['sass']);
	gulp.watch('data/*.yml', ['yaml']);
	gulp.watch('bower_components/**', ['bower']);
});

gulp.task('all', ['serve:development', 'bower', 'browserify', 'sass', 'yaml']);
gulp.task('default', ['all', 'watch']);
