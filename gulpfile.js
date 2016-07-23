var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var inject = require('gulp-inject');
var gnf = require('gulp-npm-files');


/*
 * Dispara tarefas quando há alteração em um dos arquivos
 */
gulp.task('watch', ['browserSync', 'inject'], function () {
    gulp.watch('app/**/*.html', ['inject']); 
    gulp.watch('.tmp/**/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('app/css/**/*.css', browserSync.reload);
    gulp.watch('app/scss/**/*.scss', ['sass']);
})

/*
 * inicia browser apontando para arquivos temporários
 */
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: ['.tmp', 'app', '.'],
            browser: ["google chrome", "firefox"]
        }
    })
})


//<!--build:js js/main.min.js -->
//		<!-- inject:main --> <!-- endinject -->
//        <!-- endbuild -->

//<!--build:js js/vendor.min.js -->
//		<!-- inject:js --> <!-- endinject -->
//		<!-- endbuild -->


/*
 * injeta scripts e css no html
 */
gulp.task('inject', ['sass'], function () {
   // Injeta scripts da aplicação	 
	gulp.src('./app/*.html')
	  .pipe(inject(gulp.src('./app/**/*.js', {read:'false'}), 
                   {
                        starttag: '<!-- inject:main -->',
                        removeTags: 'true',
                        relative:'true'
                    })
           )
	  .pipe(inject(
          gulp.src(gnf(), {base:'./'})
                .pipe(filter('**/*.min.css')), 
                   {
                        removeTags: 'true'
                    })
           )
      .pipe(inject(
          gulp.src('./app/css/**/*.css'), 
                   {
                        removeTags: 'true',
                        starttag: '<!-- inject:main_css -->',
                        relative:'true'
                    })
           )
      .pipe(inject(
                gulp.src(gnf(), {base:'./'})
                .pipe(filter('**/*.min.js')),
                {
                    starttag: '<!-- inject:js -->',
                    removeTags: 'true'
                }
            )
       )
	  .pipe(gulp.dest('.tmp'));
});


/*
 * Compila sass
 */
gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
})

