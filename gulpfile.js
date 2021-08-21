const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const terser = require("gulp-terser");
const changed = require("gulp-changed");
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const cssnano = require("cssnano");
const browsersync = require("browser-sync");

//scssからcssに変換
const scssTask = () => {
  return src("./src/scss/**/*.scss")
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(changed("./docs/css"))
    .pipe(dest("./docs/css"));
};

//JSファイルの最適化
const jsTask = () => {
  return src("./src/js/**/*.js")
    .pipe(terser())
    .pipe(changed("./docs/js"))
    .pipe(dest("./docs/js"));
};

//htmlをpublicに書き出し
const htmlTask = () => {
  return src("./src/**/*.html")
    .pipe(changed("./docs"))
    .pipe(dest("./docs"));
};

//画像の圧縮
//gulp-imagemin ^8.0.0だと動きません。
const imageTask = () => {
  return src("./src/img/**")
    .pipe(changed("./docs/img"))
    .pipe(
      imagemin([
        pngquant({
          quality: [0.6, 0.7],
          speed: 1,
        }),
        mozjpeg({ quality: 65 }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle(),
      ])
    )
    .pipe(dest("./docs/img"));
};

//監視
const watchTask = () => {
  watch("./docs/**/*.html", series(htmlTask, browsersyncReload));
  watch("./docs/img/**", series(imageTask, browsersyncReload));
  watch("./docs/scss/**/*.scss", series(scssTask, browsersyncReload));
  watch("./docs/js/**/*.js", series(jsTask, browsersyncReload));
};

//browsersyncの開始
const browsersyncServe = (cb) => {
  browsersync.init({
    server: {
      baseDir: "./docs",
    },
  });
  cb();
};

//browsersyncのリロード
const browsersyncReload = (cb) => {
  browsersync.reload();
  cb();
};

exports.run = series(htmlTask, imageTask, scssTask, jsTask, browsersyncServe, watchTask);

exports.build = series(htmlTask, imageTask, scssTask, jsTask);
