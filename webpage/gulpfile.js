/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/**
 * Gulp Script to automate the creation of
 * an optimized ESP webpage (gzipped)
 *
 * This script can:
 *  - optimize the images compression
 *  - inline all the styles, scripts and images assets
 *  - minify the webpage
 *  - compress to gzip
 *  - convert to C byte array and save a C header file
 *
 * @author Samuel Carreira
 */
'use strict';

const {
  src,
  dest,
  series,
  watch,
} = require('gulp');

const inlinesource = require('gulp-inline-source');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const del = require('del');
const size = require('gulp-size');
const gzip = require('gulp-gzip');
const purgecss = require('gulp-purgecss');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const nodemon = require('gulp-nodemon');

const pckg = require('./package.json');

const path = require('path');
const fs = require('fs');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const browserSync = require('browser-sync').create();

const paths = {
  scssPath: './src/scss/**/*.scss',
  htmlPath: './src/*.html',
  jsPath: './src/js/*.js',
  distPath: './dist',
  imgPath: './src/img/*',
};

function sassCompiler() {
  const plugins = [cssnano];

  return src(paths.scssPath)
      .pipe(
          sass({
            outputStyle: 'expanded',
          }).on('error', sass.logError),
      )
      .pipe(postcss(plugins))
  // .pipe(purgecss({
  //     content: [paths.htmlPath],
  //     fontFace: true
  // }))
      .pipe(dest('./src/css'))
      .pipe(browserSync.stream());
}


function sassCompilerDev() {
  return src(paths.scssPath)
      .pipe(sourcemaps.init())
      .pipe(
          sass({
            outputStyle: 'expanded',
          }).on('error', sass.logError),
      )
      .pipe(purgecss({
        content: [paths.htmlPath],
        fontFace: true,
      }))
      .pipe(sourcemaps.write())
      .pipe(dest('./src/css'))
      .pipe(browserSync.stream());
}


function watchFolder() {
  watch(paths.scssPath, sassCompilerDev);
  watch(paths.jsPath).on('change', browserSync.reload);
  watch(paths.htmlPath).on('change', browserSync.reload);
}

function buildPage() {
  return src(paths.htmlPath)
      .pipe(replace('{VERSION}', pckg.version))
      .pipe(
          inlinesource({
            compress: true,
            svgAsImage: false,
          }),
      )
      .pipe(
          htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
          }),
      )
      .pipe(
          size({
            showTotal: false,
            showFiles: true,
          }),
      )
      .pipe(dest(paths.distPath));
}

function gzipOutput() {
  return src('./dist/*')
      .pipe(
          gzip({
            gzipOptions: {
              level: 9,
            },
          }),
      )
      .pipe(
          size({
            showTotal: false,
            showFiles: true,
          }),
      )
      .pipe(dest('./dist'));
}

/**
 * Get a list of all .gz files
 */
function getFileList() {
  const fileObjs = fs.readdirSync(paths.distPath, {
    withFileTypes: false,
  });
  const filter = ['.gz'];

  const glob = [];

  fileObjs.forEach((file) => {
    if (filter.includes(path.extname(file))) {
      glob.push(file);
    }
  });

  return glob;
}


/**
 * Convert File content to C byte array
 * @author https://github.com/cristidbr/aircore/blob/master/utilities/ESP-Gzip/bin/linker.js
 * @param {string} filename
 * @return {object}
 */
function convertToByteArray(filename) {
  const originalBuffer = fs.readFileSync(
      path.resolve(paths.distPath, filename),
  );

  const newBuffer = new Buffer.from(originalBuffer);

  let text = '{ ';

  const size = originalBuffer.length;

  for (let j = 0; j < size; j++) {
    const c_code = newBuffer[j];
    text += '0x' + ('00' + c_code.toString(16)).substr(-2);
    if (size - 1 != j) text += ', ';
  }
  text += ' };';

  return {
    content: text,
    size,
  };
}

/**
 * Compress output
 */
function compressOutput(cb) {
  const glob = getFileList();

  glob.forEach((file) => {
    const formatedFilename = path.parse(file).name.replace('.', '_');

    let fileContent = `/**
* source       ${file}  
* generated    ${new Date().toLocaleString()}
*/`;

    fileContent += `\r\n#ifndef ${formatedFilename.toUpperCase()}
#define ${formatedFilename.toUpperCase()}\r\n\r\n`;

    const byteArray = convertToByteArray(file);

    fileContent += `const char ${formatedFilename}[${byteArray.size}] PROGMEM = ${byteArray.content}`;

    fileContent += `\r\n\r\n#endif /* ${formatedFilename.toUpperCase()} */`;

    const cFileName = path.resolve(paths.distPath, formatedFilename + '.h');

    fs.writeFileSync(cFileName, fileContent, 'ascii');

    console.log(`Done writing: ${cFileName}`);
  });

  cb();
}

function minifyImages() {
  return src(paths.imgPath)
      .pipe(
          imagemin([
            imagemin.gifsicle({
              interlaced: true,
            }),
            imagemin.mozjpeg({
              quality: 75,
              progressive: true,
            }),
            imagemin.optipng({
              optimizationLevel: 7,
            }),
            imagemin.svgo({
              plugins: [{
                removeViewBox: true,
              },
              {
                cleanupIDs: false,
              },
              ],
            }),
          ]), {
            verbose: true,
          },
      )
      .pipe(dest(paths.distPath));
}

function devServer(cb) {
  let callbackCalled = false;
  return nodemon({
    script: './src_server/server.js',
    env: {
      PORT: 8000,
    },
  }).on('start', () => {
    if (!callbackCalled) {
      callbackCalled = true;
      cb;
    }
  });
}

function clean(cb) {
  return del(paths.distPath, cb);
}

function help(cb) {
  console.log('Available tasks: build, dev, minifyImages');
  cb();
}

function dev(cb) {
  browserSync.init(null, {
    open: false,
    // server: {
    //     baseDir: "./src"
    // },
    proxy: 'http://localhost:8000',
    serveStatic: [{
      dir: './src',
    }],
  });
  devServer();
  watchFolder();
  cb();
}

exports.dev = dev;

exports.build = series(
    clean,
    sassCompiler,
    buildPage,
    gzipOutput,
    compressOutput,
);

exports.minifyImages = minifyImages;

exports.default = help;
