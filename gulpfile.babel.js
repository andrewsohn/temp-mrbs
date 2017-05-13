'use strict';
 
import gulp from 'gulp';
import gutil from 'gulp-util';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';

var exec = require('child_process').exec;
// import config from './configVars';

const $ = gulpLoadPlugins();

gulp.task('build', () => {
    return gulp.src(`./src/*.js`)
        .pipe($.babel())
        .pipe(gulp.dest(`./dist`));
});

gulp.task('start', (cb) => {

    let jsname = 'sch-5-min';
    //jsname = 'test';

    exec(`node dist/${jsname}.js`, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });

});

gulp.task('watch', () => {
    let watcher = {
        babel: gulp.watch(`./src/*.js`, ['build','start'])
    };

    let notify = (event) => {
        gutil.log('File', gutil.colors.yellow(event.path), 'was', gutil.colors.magenta(event.type));
    };

    for(let key in watcher) {
        watcher[key].on('change', notify);
    }
});
// gulp.task('eslint', function() {
//     return gulp.src([`${config().PATHS.DEV}/**/*.js`])
//         .pipe($.eslint({
//             'extends': './.eslintrc'
//         }))
//         .pipe($.eslint.format())
//         .pipe($.eslint.failAfterError());
// });

// gulp.task('clean', () => {
//     return gulp.src([config().PATHS.BUILD, config().PATHS.DIST, config().PATHS.JSDOC], { read: false })
//         .pipe($.clean({ force: true }));
// });

// gulp.task('core-compile', () => {
//     return gulp.src(`${config().PATHS.DEV}/core/main.js`)
//         .pipe($.inject(gulp.src([`${config().PATHS.DEV}/core/modules/*.js`]), {
//             starttag: '/* inject: modules */',
//             endtag: '/* endinject */',
//             transform: function(filePath, file){
//                 return file.contents.toString('utf8')
//             }
//         }))
//         .pipe($.sourcemaps.init())
//         .pipe($.babel())
//         .pipe($.concat('hui-core.js'))
//         .pipe($.sourcemaps.write('.'))
//         .pipe($.jsbeautifier())
//         .pipe($.header(config().HEADER))
//         .pipe(gulp.dest(config().PATHS.BUILD));
// });

// gulp.task('sub-compile', () => {
//     return gulp.src([`${PATHS.DEV}/**/*.js`])
//         .pipe($.sourcemaps.init())
//         .pipe($.babel())
//         .pipe($.concat('smg.global.layermanager.js'))
//         .pipe($.sourcemaps.write('.'))        
//         .pipe($.jsbeautifier())
//         .pipe($.header(config().HEADER))
//         .pipe(gulp.dest(PATHS.BUILD));
// });

// gulp.task('core-uglify', () => {
//     gulp.src(`${config().PATHS.BUILD}/*.js`)
//         .pipe(gulp.dest(config().PATHS.DIST));
//     gulp.src(`${config().PATHS.BUILD}/*.js`)
//         .pipe($.rename({ suffix: '.min' }))
//         .pipe($.uglify())
//         .pipe(gulp.dest(config().PATHS.DIST));
// });

gulp.task('default', () => {
//    runSequence('eslint', 'clean', 'core-compile', 'core-uglify');
    runSequence('build');
});