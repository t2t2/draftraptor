var config = require('../config')
if (config.tasks.js) {
	var gulp = require('gulp')

	gulp.task('webpack:watch', function (callback) {
		var browserSync = require('browser-sync'),
			initialCompile = false,
			logger = require('../lib/compileLogger'),
			webpack = require('webpack'),
			webpackConfig = require('../lib/webpack-multi-config')

		webpack(webpackConfig('development')).watch(200, function (err, stats) {
			logger(err, stats)
			browserSync.reload()

			if (!initialCompile) {
				initialCompile = true
				callback()
			}
		})
	})
}

