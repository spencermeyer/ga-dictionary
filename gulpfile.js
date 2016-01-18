var gulp           = require('gulp');
var gutil          = require('gulp-util');
var sass           = require('gulp-ruby-sass');
var connect        = require('gulp-connect');
var yaml           = require('gulp-yaml');
var browserify     = require('browserify');
var source         = require('vinyl-source-stream');
var mainBowerFiles = require('main-bower-files');
var flatten        = require('gulp-flatten');
var gulpFilter     = require('gulp-filter');
var uglify         = require('gulp-uglify');
var minifycss      = require('gulp-minify-css');
var rename         = require('gulp-rename');

gulp.task('connect', function () {
	// Serve the public website from localhost:4000
	connect.server({
		root: 'public',
		port: 4000
	});
});

// grab libraries files from bower_components, minify and push in /public
gulp.task('bower', function() {
  var jsFilter   = gulpFilter('*.js', { restore: true });
  var scssFilter = gulpFilter('*.scss', { restore: true });
  var cssFilter  = gulpFilter('*.css', { restore: true });
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf'], { restore: true });
	var dest_path  = "./assets";

  return gulp.src(mainBowerFiles())

  // grab vendor js files from bower_components, minify and push in /public
  .pipe(jsFilter)
  .pipe(gulp.dest(dest_path + '/js/'))
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(gulp.dest(dest_path + '/js/'))
  .pipe(jsFilter.restore)

	// grab vendor css files from bower_components, minify and push in /public
	.pipe(scssFilter)
	.pipe(gulp.dest(dest_path + '/scss'))
	.pipe(cssFilter.restore)

  // grab vendor css files from bower_components, minify and push in /public
  .pipe(cssFilter)
  .pipe(gulp.dest(dest_path + '/css'))
  .pipe(minifycss())
  .pipe(rename({
      suffix: ".min"
  }))
  .pipe(gulp.dest(dest_path + '/css'))
  .pipe(cssFilter.restore)

  // grab vendor font files from bower_components and push in /public
  .pipe(fontFilter)
  .pipe(flatten())
  .pipe(gulp.dest(dest_path + '/fonts'))
	.pipe(fontFilter.restore);
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
	return sass('./assets/scss/style.scss')
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
	gulp.watch('./assets/scss/style.scss', ['sass']);
	gulp.watch('data/*.yml', ['yaml', 'browserify']);
	gulp.watch('bower_components/**', ['bower']);
});

gulp.task('default', ['connect', 'bower', 'watch']);
