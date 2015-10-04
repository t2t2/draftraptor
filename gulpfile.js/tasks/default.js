var gulp = require('gulp')

gulp.task('default', function (cb) {
	var gulpSequence = require('gulp-sequence'),
		getEnabledTasks = require('../lib/getEnabledTasks'),
		tasks = getEnabledTasks('watch')
	
	gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, 'watch', cb)
})
