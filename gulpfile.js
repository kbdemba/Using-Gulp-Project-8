'use strict';

  const gulp = require("gulp"),
      concat = require("gulp-concat"),
    imagemin = require('gulp-imagemin'),
      uglify = require("gulp-uglify"),
      rename = require("gulp-rename"),
        sass = require("gulp-sass"),
       clean = require("del"),
        maps = require("gulp-sourcemaps"),
 browserSync = require('browser-sync').create(),
gulpSequence = require('gulp-sequence');


gulp.task("concatScripts", function(){
  return gulp.src([ "src/js/circle/autogrow.js",
                    "src/js/circle/circle.js",
                     "src/js/global.js" ])
    .pipe(maps.init())
    .pipe(concat("all.js"))
    .pipe(maps.write("./"))
    .pipe(gulp.dest('dist/scripts'))
})

//minify the concatenated js file
gulp.task("scripts", ["concatScripts"], function(){
  return gulp.src("dist/scripts/all.js")
    .pipe(uglify())
    .pipe(rename("all.min.js"))
    .pipe(gulp.dest('dist/scripts'))
})

// compile the Scss file and compress it
gulp.task("styles", function(){
  console.log("styles running")
  return gulp.src("src/sass/global.scss")
    .pipe(maps.init())
    .pipe(sass({outputStyle: "compressed"})) // after converting to css, compress the css
    .pipe(rename("main.min.css"))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("dist/styles"))
    .pipe(browserSync.reload({
      stream: true
    }))
    //.on("end", browserSync.reload); i dont need this
});

//compress the images (png & jpg) files
gulp.task("images", function(){
  return gulp.src("src/images/*.{png,jpg}") // gulp.src("src/images/*.+(jpg|jpeg|gif|png)")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/content"))

});

// add the icons and the html to the dist folder
gulp.task("copyFiles",function(){
  return gulp.src(["src/icons/**/*", "src/*.html"], {base:"src"})
  .pipe(gulp.dest("dist"))
})

// delete the dist folder
gulp.task("clean",function(){
  return clean("dist");
})


// run all the previous tasks but clean will run first then the rest run simultaneously
gulp.task("built", gulpSequence("clean", ["scripts", "styles", "images", "copyFiles"]));


gulp.task("default" , ["built"], function(){
  browserSync.init({
    //server running on LH: port 3000
      server: {
          baseDir: "./src"
      }
  });
  gulp.watch("src/sass/*.scss", ['styles']);
  gulp.watch("src/*.html").on('change', browserSync.reload);

})
