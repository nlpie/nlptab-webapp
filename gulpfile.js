'use strict';

var browserify = require('browserify')
  , del = require('del')
  , source = require('vinyl-source-stream')
  , vinylPaths = require('vinyl-paths')
  , buffer = require('vinyl-buffer')
  , gulp = require('gulp')
  , ngAnnotate = require('browserify-ngannotate');

// Load all gulp plugins listed in package.json
var gulpPlugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

var CacheBuster = gulpPlugins.cachebust;
var cachebust = new CacheBuster();

gulp.task('clean', function () {
  return gulp
    .src('./dist/', {read: false})
    .pipe(vinylPaths(del));
});

gulp.task('bower', function() {

  var install = require("gulp-install");

  return gulp.src(['./bower.json'])
    .pipe(install());
});

gulp.task('build-css', ['clean'], function () {
  return gulp.src('./styles/*')
    .pipe(gulpPlugins.sourcemaps.init())
    .pipe(gulpPlugins.sass())
    .pipe(cachebust.resources())
    .pipe(gulpPlugins.sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-template-cache', ['clean'], function () {
  return gulp.src("./partials/**/*.html")
    .pipe(gulpPlugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/partials'));
});

gulp.task('jshint', function () {
  gulp.src('./js/*.js')
    .pipe(gulpPlugins.jshint())
    .pipe(gulpPlugins.jshint.reporter('default'));
});

gulp.task('build-js', ['clean', 'build-template-cache'], function () {
  var b = browserify({
    entries: './js/app.js',
    debug: true,
    transform: [ngAnnotate]
  });
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(gulpPlugins.sourcemaps.init({loadMaps: true}))
    .pipe(gulpPlugins.uglify())
    .pipe(gulpPlugins.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy-config', ['clean'], function () {
  return gulp.src('./config.js')
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-bower', ['clean'], function () {
  return gulp.src('./bower_components/**').pipe(gulp.dest('./dist/bower_components'));
});

gulp.task('copy-bootstrap-ui', ['clean'], function () {
  return gulp.src('./ui-bootstrap-tpls-1.2.5.min.js').pipe(gulp.dest('./dist'));
});


gulp.task('build', ['clean', 'bower', 'build-css', 'build-template-cache', 'jshint', 'build-js', 'copy-bower', 'copy-bootstrap-ui', 'copy-config'], function () {
  return gulp.src('./index.html')
    .pipe(cachebust.references())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  return gulp.watch(['./index.html', './partials/*.html', './styles/*.*css', './js/**/*.js'], ['build']);
});

gulp.task('webserver', ['watch', 'build'], function () {
  gulp.src('.')
    .pipe(gulpPlugins.webserver({
      livereload: false,
      directoryListing: true,
      open: "http://localhost:8000/dist/index.html"
    }));
});

gulp.task('dev', ['watch', 'webserver']);

gulp.task('default', ['build']);
