const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const wait = require('gulp-wait');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');


/* -------- Server  -------- */
gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 5555,
            baseDir: "dist"
        }
    });

    gulp.watch('dist/**/*').on('change', browserSync.reload);
});

/* ------------ Pug compile ------------- */
gulp.task('templates:compile', function distHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
});

/* ------------ Styles compile ------------- */
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(wait(500))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('dist/css'));
});

/* ------------ JS ------------- */
gulp.task('js', function () {
  return gulp.src([
//     'source/js/form.js',
//     'source/js/navigation.js',
//     'source/js/main.js'
    'source/js/scripts.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/js'))
});

/* ------------ Sprite ------------- */
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('dist/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
    return rimraf('dist', cb);
});

/* ------------ Copy webfont ------------- */
gulp.task('copy:fonts', function () {
  return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

/* ------------ Copy images ------------- */
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('dist/images'));
});

/* ------------ Copy favicon ------------- */
gulp.task('copy:favicon', function () {
    return gulp.src('./source/*.ico')
        .pipe(gulp.dest('dist/'));
});

/* ------------ Copy ------------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:favicon'));

/* ------------ Watchers ------------- */
gulp.task('watch', function () {
    gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy', 'js'),
    gulp.parallel('watch', 'server')
)
);
