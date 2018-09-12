const gulp = require('gulp');
const sass = require('gulp-sass');
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const env = require('gulp-env');

require('dotenv').config();

const config = {
  source: './src/',
  dist: './public/'
};

const paths = {
  assets: 'assets/',
  mainSass: 'scss/main.scss',
  pugs: 'pug/index.pug',
  img: 'img/*.*',
  js: 'js/'
};

const sources = {
  assets: config.source,
  rootSass: config.source + paths.mainSass,
  pugs: config.source + paths.pugs,
  img: config.source + paths.img,
  js: config.source + paths.js
};

gulp.task('pug', function() {
  gulp.src(sources.pugs)
    .pipe(plumber())
    .pipe(pug({
      pretty: false
    }))
    .pipe(gulp.dest(config.dist))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('img', function() {
  gulp.src(sources.img)
    .pipe(gulp.dest(config.dist + paths.assets + 'img'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js', () => {
  return gulp.src(sources.js + '**/*.js')
    .pipe(concat('main.js'))
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest(config.dist + paths.assets + "js"))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('sass', function() {
  gulp.src(sources.rootSass)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('Error', sass.logError))
    .pipe(gulp.dest(config.dist + paths.assets + 'css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('start', ['pug', 'sass', 'img', 'js']);

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: config.dist
    },
    port: 8080
  });

  gulp.watch(sources.rootSass, ['sass']);
  gulp.watch(sources.img, ['img']);
  gulp.watch(sources.js, ['js']);
  gulp.watch(sources.pugs, ['pug']);
});
