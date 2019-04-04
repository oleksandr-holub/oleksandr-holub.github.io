const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();

const cssFiles = [
    './src/normalize.css',
    './src/style.css'
]

sass.compiler = require('node-sass');

function sassCompile() {
    return gulp.src('./src/**/*.scss')

    .pipe(sourcemaps.init())

    .pipe(sass().on('error', sass.logError))

    .pipe(sourcemaps.write('./'))

    .pipe(gulp.dest('./src/'));
};

function css() {
    return gulp.src(cssFiles)

    .pipe(concat('style.css'))

    .pipe(autoprefixer({
        browsers: [
            'last 2 versions',
            'IE 10'
        ],
        cascade: false
    }))

    .pipe(cleanCSS({
        level: 2
    }))

    .pipe(gulp.dest('./build/css'))

    .pipe(browserSync.stream());
}

function clean() {
    return del(['./build/css/*'])
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });

    gulp.watch('./src/**/*.css', css)
    gulp.watch('./src/**/*.scss', sassCompile);
    gulp.watch('./build/*.html').on('change', browserSync.reload);
}

gulp.task('styles', css);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(css)));
gulp.task('dev', gulp.series('build', 'watch'));