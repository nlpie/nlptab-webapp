'use strict';

var browserify = require('browserify')
  , del = require('del')
  , source = require('vinyl-source-stream')
  , vinylPaths = require('vinyl-paths')
  , gulp = require('gulp');

// Load all gulp plugins listed in package.json
var gulpPlugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

// Define file path variables
var paths = {
  src: 'src/',
  src_js: 'src/js/',
  dist: 'app/',
  dist_js: 'app/js/',
  tmp: '.tmp/'
};

var liveReload = true;

gulp.task('clean', function () {
  return gulp
  .src([paths.tmp, paths.dist_js], {read: false})
  .pipe(vinylPaths(del));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('lint', function () {
  return gulp
  .src(['gulpfile.js',
      paths.src_js + '**/*.js'
  ])
  .pipe(gulpPlugins.eslint())
  .pipe(gulpPlugins.eslint.format());
});

gulp.task('browserify', function () {
  return browserify(paths.src_js + 'app.js', {debug: true})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(paths.dist_js))
  .pipe(gulpPlugins.connect.reload());
});

gulp.task('ngAnnotate', ['lint'], function () {
  return gulp.src([
      paths.src_js + '**/*.js'
  ])
  .pipe(gulpPlugins.ngAnnotate())
  .pipe(gulp.dest(paths.tmp + 'ngAnnotate'));
});

gulp.task('browserify-min', ['ngAnnotate'], function () {
  return browserify(paths.tmp + 'ngAnnotate/app.js')
  .bundle()
  .pipe(source('bundle.min.js'))
  .pipe(gulpPlugins.streamify(gulpPlugins.uglify({mangle: false})))
  .pipe(gulp.dest(paths.dist_js));
});

gulp.task('server', ['browserify'], function () {
  gulpPlugins.connect.server({
    root: 'app',
    livereload: liveReload
  });
});

gulp.task('watch', function () {
  gulp.start('server');
  gulp.watch(paths.src_js + '**/*.js', ['browserify-min']);
});

gulp.task('fast', ['clean'], function () {
  gulp.start('browserify');
});

gulp.task('default', ['clean'], function () {
  liveReload = false;
  gulp.start('browserify', 'browserify-min');
});
