const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browserSync = require("browser-sync");

function scssTasks() {
  return src("src/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("css", { sourcemaps: "." }));
}

function jsTasks() {
  return src("src/js/scripts.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("js", { sourcemaps: "." }));
}

function browsersyncServer(cb) {
  browserSync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browserSync.reload();
  cb();
}

function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["src/scss/**/*.scss", "src/js/**/*.js"],
    series(scssTasks, jsTasks, browsersyncReload)
  );
}

exports.default = series(
  scssTasks,
  jsTasks,
  browsersyncServer,
  watchTask
);
