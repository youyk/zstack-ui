var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
// var autoprefixer = require('gulp-autoprefixer');

// Minify and templateCache your Angular Templates
// Add a 'templates' module dependency to your app:
// var app = angular.module('appname', [ ... , 'templates']);

gulp.task('templates', function () {
  return gulp.src([
      './app/**/*.html',
      './app/index.html',
      '!./app/bower_components/**',
      '!./app/css/**',
      '!./app/vendor/**'
    ])
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templates('templates.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task('font', function() {
  gulp.src(['./app/bower_components/bootstrap/dist/fonts/**/*'], {base: './app/bower_components/bootstrap/dist/'})
  .pipe(gulp.dest('zstack_dashboard/static/'))
})

gulp.task('css', function() {
  gulp.src([
      './app/bower_components/angular-bootstrap/ui-bootstrap-csp.css',
      './app/bower_components/bootstrap/dist/css/bootstrap.min.css',
      './app/bower_components/ng-inline-edit/dist/ng-inline-edit.min.css',
      './app/css/app.css'
    ])
    .pipe(sourcemaps.init())
    // .pipe(autoprefixer({
    //   browsers: ['last 2 versions'],
    //   cascade: false
    // }))
    .pipe(concat('app.css'))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('zstack_dashboard/static/css'))
})

gulp.task('vendor', function() {
  gulp.src(['./app/vendor/**/*'], {base: './app'})
  .pipe(gulp.dest('zstack_dashboard/static'))
})

gulp.task('clean', function() {
  return del.sync([
      './zstack_dashboard/static/**',
      './tmp/**'
    ]);
});

gulp.task('index', function() {
  gulp.src('./app/index_dist.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('zstack_dashboard/static'));
})

gulp.task('static', ['clean', 'templates', 'font', 'css', 'vendor', 'index'], function() {
  gulp.src([
      './app/bower_components/angular/angular.js',
      './app/bower_components/angular-ui-router/release/angular-ui-router.js',
      './app/bower_components/angular-cookies/angular-cookies.min.js',
      './app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      './app/bower_components/angular-translate/angular-translate.min.js',
      './app/bower_components/socket.io-client/dist/socket.io.min.js',
      './app/bower_components/cryptojslib/rollups/sha512.js',
      './app/bower_components/ng-inline-edit/dist/ng-inline-edit.min.js',
      './app/js/app.js',
      './tmp/templates.js',
      './app/js/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('zstack_dashboard/static'));
});

gulp.task('default', ['static']);