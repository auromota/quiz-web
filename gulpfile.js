var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyhtml = require('gulp-minify-html');
var minifycss = require('gulp-minify-css');
var minifyjson = require('gulp-jsonminify');
var htmlreplace = require('gulp-html-replace');

gulp.task('default', ['build']);

gulp.task('build', ['copyResources', 'minifyJs', 'minifyCss', 'useCdn', 'minifyPartials']);

gulp.task('copyResources', ['copyImg', 'minifyJson']);

gulp.task('copyImg', function () {
    return gulp.src('img/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('minifyJson', function () {
    return gulp.src('questions.json')
        .pipe(minifyjson())
        .pipe(gulp.dest('dist'));
})

gulp.task('minifyJs', function () {
    return gulp.src(['js/*.js', 'js/**/*.js'])
        .pipe(uglify({
            noSource: true
        }))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minifyCss', function () {
    return gulp.src(['css/*.css'])
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minifyPartials', function () {
    return gulp.src('partials/*.html')
        .pipe(minifyhtml())
        .pipe(gulp.dest('dist/partials/'));
});

gulp.task('useCdn', ['copyNgSweetAlert'], function () {
    return gulp.src('./index.html')
        .pipe(htmlreplace({
            js: {
                src: gulp.src('gulp/cdn-js.html'),
                tpl: '%s'
            },
            sweetalert: {
                src: null,
                tpl: '<script src="/lib/SweetAlert.min.js"></script>'
            },
            css: {
                src: gulp.src('gulp/cdn-css.html'),
                tpl: '%s'
            }
        }))
        .pipe(minifyhtml())
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyNgSweetAlert', function () {
    return gulp.src(['node_modules/angular-sweetalert/SweetAlert.min.js'])
        .pipe(gulp.dest('dist/lib/'));
})