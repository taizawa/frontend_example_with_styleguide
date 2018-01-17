var gulp = require('gulp')
var ejs = require('gulp-ejs')

gulp.task('build:css', function () {
    var concat = require('gulp-concat')
    var postcss = require('gulp-postcss')
    var autoprefixer = require('autoprefixer')
    var customProperties = require('postcss-custom-properties')
    var nested = require('postcss-nested')
    var Import = require('postcss-import')
    var styleGuide = require('postcss-style-guide')
    var nano = require('cssnano')

    return gulp.src('./src/css/index.css')
        .pipe(postcss([
            Import,
            customProperties({ preserve: true }),
            nested,
            autoprefixer,
            styleGuide({
                project: 'The new style guide of e-sogi.com.',
                dest: 'dest/styleguide/index.html',
                showCode: true,
                themePath: 'styleguide_theme'
            }),
            nano
        ]))
        .pipe(concat('index.min.css'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('build:html', function () {
    gulp.src(['./src/*.ejs', './src/template/page/**/*.ejs'])
        .pipe(ejs(
          {
            pageTitle: 'いい葬儀',
            cssPath: '/css'
          },
          { // A hash object for ejs options

          },
          { // A hash object to configure the plugin
            ext: '.html'
          }
        ))
        .pipe(gulp.dest('./dist'))
});

var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'dist/',
            index: 'index.html'
        },
        ui: {
          'port': 3001,
          'weinre': {
            'port': 8080
          }
        },
        port: '3000'
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['browser-sync', 'browser-syncSG'], function () {
    gulp.watch('src/**/*.ejs', ['build:html', 'bs-reload']);
    gulp.watch('src/**/*.css', ['build:css', 'bs-reload', 'bs-reloadSG']);
});

var browserSyncSG = require('browser-sync').create();

gulp.task('browser-syncSG', function() {
    browserSyncSG.init({
        server: {
            baseDir: 'dest/styleguide',
            index: 'index.html'
        },
        ui: {
          'port': 3331,
          'weinre': {
            'port': 8080
          }
        },
        port: '3333'
    });
});

gulp.task('bs-reloadSG', function () {
    browserSyncSG.reload();
});
