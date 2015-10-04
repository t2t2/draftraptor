var config = require('../config')
if (config.tasks.images) {
	var gulp = require('gulp')

	gulp.task('images', function () {
		var browserSync = require('browser-sync'),
			changed = require('gulp-changed'),
			imagemin = require('gulp-imagemin'),
			path = require('path')

		var paths = {
			src:  path.join(config.root.src, config.tasks.images.src, '/**'),
			dest: path.join(config.root.dest, config.tasks.images.dest)
		}

		return gulp.src(paths.src)
			.pipe(changed(paths.dest)) // Ignore unchanged files
			.pipe(imagemin()) // Optimize
			.pipe(gulp.dest(paths.dest))
			.pipe(browserSync.reload({stream: true}))
	})
}


