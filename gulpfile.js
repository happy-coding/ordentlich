/*global -$ */
'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var paths = {
  js: ['app/assets/js/**/*.js'],
  css: ['app/assets/css/**/*.scss'],
  images: ['app/assets/images/**/*'],
  hbs: ['app/**/*.hbs']
};

gulp.task('styles', function () {
  return gulp.src('app/assets/css/screen.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('ordentlich/assets/css'))
    .pipe(reload({stream: true}));
});

gulp.task('highlightjs-js', function () {
  return gulp.src('bower_components/highlightjs/highlight.pack.js')
    .pipe(gulp.dest('ordentlich/assets/js/highlightjs'));
});

gulp.task('highlightjs-css', function () {
  return gulp.src('bower_components/highlightjs/styles/googlecode.css')
    .pipe(gulp.dest('ordentlich/assets/css/highlightjs'));
});


gulp.task('scripts', function () {
  return gulp.src('app/assets/js/**/*')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.useref())
    .pipe(gulp.dest('ordentlich/assets/js'));
});

gulp.task('images', function () {
  return gulp.src('app/assets/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('ordentlich/assets/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('ordentlich/assets/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/**/*.*',
    '!app/*.html',
    '!app/assets/**/.*',
    '!app/**/*.scss'
  ], {
    dot: true
  }).pipe(gulp.dest('ordentlich'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'ordentlich']));

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/assets/css/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/assets/css'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['styles', 'highlightjs-js','highlightjs-css', 'scripts', 'images', 'fonts', 'extras'], function () {
  return gulp.src('ordentlich/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.css, ['styles']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.hbs, ['extras']);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
