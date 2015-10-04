var gulp = require('gulp')

gulp.task('migrate', function (callback) {
	var config = require('../config'),
		getMigrator = require('../lib/getMigrator'),
		fs = require('fs'),
		helpers = require('sequelize-cli/lib/helpers')

	helpers.config.config = {}

	getMigrator(function (error, migrator) {
		if (error) {
			console.error(error)
			return callback(1)
		}

		migrator.pending().then(function (migrations) {
			if (migrations.length === 0) {
				console.log('No migrations')
			} else {
				return migrator.up()
			}
		}).then(function () {
			callback()
		}).catch(function (err) {
			console.error(err)
			callback(1)
		})
	})
})