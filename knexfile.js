require('babel-core/register')

var _ = require('lodash')
var parseConnectionString = require('knex/lib/util/parse-connection')

var config = require('./src/config').default

var connectionOptions = config.get('database.options')

if (config.has('database.url') && config.get('database.url')) {
	_.assign(connectionOptions, parseConnectionString(config.get('database.url')))
}

module.exports = _.defaultsDeep(connectionOptions, {
	migrations: {
		directory: './database/migrations',
		stub: './src/stubs/migration.stub'
	},
	seeds: {
		directory: './database/seeds'
	}
})
