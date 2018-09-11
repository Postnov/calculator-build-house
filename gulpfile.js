'use strict';

var gulp        = require('gulp'),
    rimraf      = require('rimraf'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,

    //css
    sass        = require('gulp-sass'),
    prefixer    = require('gulp-autoprefixer'),
    csscomb     = require('gulp-csscomb'),
    media_group = require('gulp-group-css-media-queries'),
    cssmin      = require('gulp-minify-css'),

    //js
    imports     = require('gulp-imports'),
    minify = require('gulp-minify'),

    //html, pug
    pug         = require('gulp-pug'),
    prettyHtml  = require('gulp-pretty-html'),

    //img
    tinypng = require('gulp-tinypng-unlimited');





var path = {
    dist: {
        html:   'dist/',
        js:     'dist/js/',
        css:    'dist/css/',
        img:    'dist/images/',
        fonts:  'dist/fonts/'
    },
    src: {
        pug:    'src/pug/*.pug',
        css:    'src/css/main.scss',
        js:     'src/js/main.js',
        img:    'src/images/**/*.*',
        fonts:  'src/fonts/**/*.*'
    },
    watch: {
        js:     'src/**/*.js',
        pug:    'src/**/*.pug',
        css:    'src/**/*.scss',
        img:    'src/images/**/*.*',
        fonts:  'src/fonts/**/*.*'
    },
    clean: './dist',
    cleanImg: './dist/images'
};



var config = {
    server: {
        baseDir: './dist'
    },
    host: 'localhost',
    port: 3001,
};



gulp.task('pug:build', function() {
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({ stream: true }));
})


gulp.task('pug:comb', function () {
    return gulp.src(path.src.pug)
        .pipe(pug({
            pretty: true
        }))
        .pipe(plumber())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(prettyHtml({
            indent_size: 4,
            indent_char: ' ',
            unformatted: ['code', 'pre', 'em', 'strong', 'i', 'b', 'br']
        }))
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({ stream: true }));
});



gulp.task('js:build', function () {
    return gulp.src(path.src.js)
        .pipe(imports())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({ stream: true }));
})

gulp.task('js:min', function () {
    return gulp.src(path.src.js)
        .pipe(imports())
        .pipe(minify())
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({ stream: true }));
})

gulp.task('css:build', function () {
    return gulp.src(path.src.css)
        .pipe(sass())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(plumber())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({ stream: true }));
});

gulp.task('css:polish', function () {
    return gulp.src(path.src.css)
        .pipe(sass())
        .pipe(prefixer({
            browsers: ['last 15 versions'],
            cascade: false,
            grid: false
        }))
        .pipe(media_group())
        .pipe(csscomb("yandex"))
        .pipe(gulp.dest(path.dist.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssmin())
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({ stream: true }));
})


gulp.task('images:optimize', function () {
    return gulp.src(path.src.img)
        .pipe(tinypng({
        }))
        .pipe(gulp.dest(path.dist.img))
});

gulp.task('images:build', function(cb) {
    rimraf(path.cleanImg, cb)
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.dist.img))
});


gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});


gulp.task('build', [
    'pug:build',
    'pug:comb',
    'css:build',
    'js:build',
    'images:build',
    'fonts:build',
    'css:polish',
    'js:min'
])


gulp.task('watch', ['build'], function () {
    gulp.watch(path.watch.css, ['css:build'])
    gulp.watch(path.watch.js, ['js:build'])
    gulp.watch(path.watch.pug, ['pug:build'])
    gulp.watch(path.watch.img, ['images:build'])
})

gulp.task('webserver', function() {
    browserSync(config);
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);
