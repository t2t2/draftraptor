var config = require('../config')
if (config.tasks.fonts) {
	var gulp = require('gulp')

	gulp.task('fonts', function () {
		var browserSync = require('browser-sync'),
			changed = require('gulp-changed'),
			path = require('path')

		var paths = {
			src:  path.join(config.root.src, config.tasks.fonts.src, '/**/*'),
			dest: path.join(config.root.dest, config.tasks.fonts.dest)
		}

		return gulp.src(paths.src)
			.pipe(changed(paths.dest)) // Ignore unchanged files
			.pipe(gulp.dest(paths.dest))
			.pipe(browserSync.reload({stream: true}))
	})
}



