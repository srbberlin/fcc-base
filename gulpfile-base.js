const gulp = require('gulp')
const sequence = require('gulp-sequence').use(gulp)
const sass = require('gulp-sass')
const scss = require('gulp-scss')
const sourcemaps = require('gulp-sourcemaps')
const babelify = require('babelify')
const browserify = require('browserify')
const browserSync = require('browser-sync')
const source = require('vinyl-source-stream')
const del = require('del')

var cnf = {
  src:     __dirname + '/src',
  htmlin:  __dirname + '/src/html/**/*.html',
  cssin:   __dirname + '/src/css/**/*.css',
  sassin:  __dirname + '/src/css/**/*.sass',
  scssin:  __dirname + '/src/css/**/*.scss',
  datain:  __dirname + '/src/js/**/*.json',
  jsin:    __dirname + '/src/js/**/*.js',
  jsentry: __dirname + '/src/js/index.js',
  imgin:   __dirname + '/src/img/**/*',
  cssout:  __dirname + '/docs/css/',
  jsout:   __dirname + '/docs/js/',
  imgout:  __dirname + '/docs/img/',
  htmlout: __dirname + '/docs'
}

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('serve', ['images', 'data', 'scripts', 'css', 'html'], function () {
  browserSync({
    server: cnf.htmlout
  })

  gulp.watch(cnf.datain, ['dataw'])
  gulp.watch(cnf.jsin, ['jsw'])
  gulp.watch(cnf.cssin, ['css'])
  gulp.watch(cnf.sassin, ['sass'])
  gulp.watch(cnf.scssin, ['scss'])
  gulp.watch(cnf.imgin, ['imagesw'])
  gulp.watch(cnf.htmlin, ['htmlw'])
})

gulp.task('dataw', function (cb) { sequence(['data', 'reload'])(cb) })
gulp.task('jsw', function (cb) { sequence('scripts', 'reload')(cb) })
gulp.task('cssw', function (cb) { sequence(['css', 'reload'])(cb) })
gulp.task('sassw', function (cb) { sequence(['sass', 'reload'])(cb) })
gulp.task('scssw', function (cb) { sequence(['scss', 'reload'])(cb) })
gulp.task('imagesw', function (cb) { sequence(['images', 'reload'])(cb) })
gulp.task('htmlw', function (cb) { sequence(['html', 'reload'])(cb) })

gulp.task('data', function () {
  return gulp.src(cnf.datain)
    .pipe(gulp.dest(cnf.jsout))
})

gulp.task('css', function () {
  return gulp.src(cnf.cssin)
    .pipe(gulp.dest(cnf.cssout))
})

gulp.task('sass', function () {
  let path = cnf.sassin
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cnf.cssout))
})

gulp.task('scss', function () {
  let path = cnf.scssin
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(scss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cnf.cssout))
})

gulp.task('scripts', function () {
  return browserify({entries: cnf.jsentry, extensions: ['.js'], debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest(cnf.jsout))
})

gulp.task('images', function () {
  return gulp.src(cnf.imgin)
    .pipe(gulp.dest(cnf.imgout))
})

gulp.task('html', function () {
  return gulp.src(cnf.htmlin)
    .pipe(gulp.dest(cnf.htmlout))
})

gulp.task('clean', function () {
  let paths = [
    cnf.jsout + '/**/*.js',
    cnf.cssout + '/**/*.css',
    cnf.imgout + '/**/*',
    cnf.htmlout + '/**/*.html'
  ]
  return del(paths).then(function () {
  }).catch(function () {
  })
})

gulp.task('build', ['scripts', 'data', 'css', 'scss', 'sass', 'html'])

gulp.task('default', ['serve'])