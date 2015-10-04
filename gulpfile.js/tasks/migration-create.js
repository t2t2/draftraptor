var gulp = require('gulp')

gulp.task('migration:create', function (callback) {
	var argv = require('minimist')(process.argv.slice(3)),
		config = require('../config'),
		fs = require('fs'),
		helpers = require('sequelize-cli/lib/helpers'),
		path = require('path')

	helpers.config.config = {}

	var target = path.join(config.migrations.dest, helpers.path.getFileName('migration', argv.name))


	fs.writeFileSync(target,
		helpers.template.render('migrations/skeleton.js', {}, {
			beautify: false
		})
	)

	console.log('Migration created to ', target)

	callback()
})