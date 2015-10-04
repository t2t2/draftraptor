var gulp = require('gulp')

gulp.task('build:production', function (cb) {
	var config = require('../config'),
		gulpSequence = require('gulp-sequence'),
		getEnabledTasks = require('../lib/getEnabledTasks'),
		tasks = getEnabledTasks('production')

	gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'rev', cb)
})
