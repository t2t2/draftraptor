var gulp = require('gulp')

gulp.task('browserSync', ['nodemon'], function () {
	var browserSync = require('browser-sync'),
		config = require('../config'),
		path = require('path')

	var settings = {
		ghostMode: false,
		proxy: {
			target: 'localhost:8000',
			ws: true,
		},
		ui: false,
	}

	return browserSync(settings)
})
