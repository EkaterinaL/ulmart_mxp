'use strict';

var gulp = require('gulp'),
        watch = require('gulp-watch'),
        pug = require('gulp-pug'),
        plumber = require('gulp-plumber'),/* Plugin show Error in code*/
        rigger = require('gulp-rigger'), /* Plugin import parts to file*/
        cssmin = require('gulp-minify-css'),
        prefixer = require('gulp-autoprefixer'),
        sass = require('gulp-sass'),
        sourcemaps = require('gulp-sourcemaps'),

        /* Plugin for JS */
        
        uglify = require('gulp-uglify'),
        
        // babel = require('gulp-babel');

        /* Plugin for Images */
        imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'),
        spritesmith = require('gulp.spritesmith'),

        rimraf = require('rimraf'),

        /* Plugin for webserver*/
        browserSync = require("browser-sync"),
        reload = browserSync.reload;


var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        pug: 'build/pug/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        pug: 'src/pug/**/*.pug',
        js: 'src/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //укажем, за изменением каких файлов хотим наблюдать
        html: 'src/**/*.html',
        pug: 'src/pug/**/*.pug',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "logvinova_e.v"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //в папку build
        .pipe(reload({stream: true})); //перезагрузим наш сервер для обновлений
});


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('pug:build', function() {
  gulp.src(path.src.pug)
    .pipe(plumber())
    .pipe(pug({pretty:true}))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/style/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        // .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'pug:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build',
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.pug], function(event, cb) {
        gulp.start('pug:build');
    });
    watch([path.watch.style], function(event, cb) {
        setTimeout(function(){
            gulp.start('style:build');
        }, 5000);
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });

    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
