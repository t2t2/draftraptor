module.exports = function (callback) {
	var Bluebird = require('bluebird'),
		config = require('../config'),
		sequelize = require('../../app/database').sequelize,
		Umzug = require('umzug')

	var migrator = new Umzug({
		storage:        'sequelize',
		storageOptions: {
			sequelize: sequelize,
			tableName: 'SequelizeMeta',
		},
		logging:        console.log,
		migrations:     {
			params:  [sequelize.getQueryInterface(), require('sequelize')],
			path:    config.migrations.dest,
			pattern: /\.js$/,
			wrap:    function (fun) {
				if (fun.length === 3) {
					return Bluebird.promisify(fun);
				} else {
					return fun;
				}
			}
		}
	})

	sequelize.authenticate()
		.then(function () {
			callback(null, migrator);
		})
		.catch(function (err) {
			callback(err)
		});
}