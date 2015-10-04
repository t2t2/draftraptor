var gulp = require('gulp')

// 5) Update asset references in HTML
gulp.task('update-html', function () {
	var config = require('../../config'),
		revReplace = require('gulp-rev-replace'),
		path = require('path');

	var manifest = gulp.src(path.join(config.root.dest, "/rev-manifest.json"))
	return gulp.src(path.join(config.root.dest, '/**/*.html'))
		.pipe(revReplace({manifest: manifest}))
		.pipe(gulp.dest(config.root.dest))
})
