var gulp = require('gulp')

gulp.task('nodemon', function (cb) {

	var nodemon = require('gulp-nodemon'),
		started = false

	nodemon({
		script: 'server.js',
		args:   ['-p', '8000', '--debug', '--password=password'],
		watch:  ['./app'],
		exetensions: ['js', 'json', 'html']
	}).on('start', function () {
		if (!started) {
			cb()
			started = true
		}
	})
})