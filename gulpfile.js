import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpCssimport from 'gulp-cssimport';
import { deleteSync } from 'del';

const htmlPath = './src/*.html';
const cssPath = './src/css/**/*.css';
const jsPath = './src/js/**/*.js';
const imgPath = './src/img/**/*';
const fontsPath = './src/fonts/**/*';

export const html = () =>
  gulp.src(htmlPath).pipe(gulp.dest('dist')).pipe(browserSync.stream());

export const css = () =>
  gulp
    .src(cssPath)
    .pipe(
      gulpCssimport({
        extensions: ['css'],
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());

export const js = () =>
  gulp.src(jsPath).pipe(gulp.dest('dist/js')).pipe(browserSync.stream());

export const copy = () => {
  return gulp
    .src([fontsPath, imgPath], {
      base: 'src',
    })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({ once: true }));
};

export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    tunnel: true,
    server: {
      baseDir: 'dist',
    },
  });

  gulp.watch(htmlPath, html);
  gulp.watch(cssPath, css);
  gulp.watch(jsPath, js);
  gulp.watch([imgPath, fontsPath], copy);
};

export const clear = (done) => {
  const result = deleteSync(['dist/**/*']);

  if (done) {
    done();
  }

  return result;
};

export const base = gulp.parallel(html, css, js, copy);

export const build = gulp.series(clear, base);

export default gulp.series(gulp.parallel(base, server));
