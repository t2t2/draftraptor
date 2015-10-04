var config = require('../config')
if (config.tasks.css) {
	var gulp = require('gulp')

	gulp.task('css', function () {
		var browserSync = require('browser-sync'),
			sass = require('gulp-sass'),
			sourcemaps = require('gulp-sourcemaps'),
			handleErrors = require('../lib/handleErrors'),
			autoprefixer = require('gulp-autoprefixer'),
			path = require('path')

		var paths = {
			src:  path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}'),
			dest: path.join(config.root.dest, config.tasks.css.dest)
		}

		return gulp.src(paths.src)
			.pipe(sourcemaps.init())
			.pipe(sass(config.tasks.css.sass))
			.on('error', handleErrors)
			.pipe(autoprefixer(config.tasks.css.autoprefixer))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.dest))
			.pipe(browserSync.reload({stream: true}))
	})

}

