'use strict';

var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');
var minifycss = require('gulp-clean-css');
var concat = require('gulp-concat');
var zip = require('gulp-zip');
var gutil = require('gulp-util');
var md5 = require("gulp-md5-plus");
var spritesmith = require('gulp.spritesmith');

var src = process.cwd() + '/src';
var assets = process.cwd() + '/public';

var webpackConf = require('./webpack.config');
/**
 * clean assets
 */
gulp.task('clean', function () {
  del.sync(assets);
});
/**
 * minify-css
 */
gulp.task('minify-css',['sprite'], function () {
  gulp.src(src + '/css/**/*.css')
    .pipe(minifycss())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(assets + '/css'));
});
/**
 * sprite
 */
gulp.task('sprite', function () {
  var spriteData = gulp.src(src + '/image/icon/*.*').pipe(spritesmith({
    imgName: '../image/pactl/sprite.png',
    cssName: 'sprite.css',
    padding: 5,
    cssTemplate: 'handlebarsStr.css.handlebars'
  }));
  spriteData.css.pipe(gulp.dest(src + '/css/'));
  spriteData.img.pipe(gulp.dest(src + '/src/'));
});
/**
 * copy 文件
 */
gulp.task('copy', function () {
    gulp.src(src + '/lib/**')
      .pipe(gulp.dest(assets + '/lib'));
    gulp.src(src + '/down/**')
      .pipe(gulp.dest(assets + '/down'));      
    gulp.src(src + '/image/**')
      .pipe(gulp.dest(assets + '/image'));
    gulp.src(src + '/i18n/**')
      .pipe(gulp.dest(assets + '/i18n'));
    gulp.src(src + '/favicon.ico')
      .pipe(gulp.dest(assets));
  })
  /**
   * run webapck
   */
gulp.task('pack', ['copy', 'minify-css'], function (done) {
  webpack(webpackConf, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({
      colors: true
    }))
    done()
  });
});
/**
 * md5 file
 */
gulp.task('file-md5', function () {
  gulp.src(assets + '/css/**/*.css')
    .pipe(md5(10, assets + '/index.html'))
    .pipe(gulp.dest(assets + '/css/'));
  gulp.src(assets + '/js/**/*.js')
    .pipe(md5(10, assets + '/index.html'))
    .pipe(gulp.dest(assets + '/js/'));
});
/**
 * watch
 */
gulp.task('watch', ['pack', 'copy', 'minify-css'], function () {
  gulp.watch([src + '/**/*.js', '!' + src + '/js/**/*.js', src + '/**/*.html'], ['pack']);
  gulp.watch([src + '/css/**/*'], ['minify-css']);
  gulp.watch([src + '/image/icon/*.*'], ['sprite']);
});

gulp.task('default', ['pack']);