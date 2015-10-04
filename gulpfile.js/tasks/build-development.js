var gulp = require('gulp')

gulp.task('build:development', function (cb) {
	var config = require('../config'),
		gulpSequence = require('gulp-sequence'),
		getEnabledTasks = require('../lib/getEnabledTasks'),
		tasks = getEnabledTasks('development')

	gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'rev', cb)
})
