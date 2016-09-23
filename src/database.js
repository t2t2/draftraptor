import _ from 'lodash'
import knex from 'knex'
import parseConnectionString from 'knex/lib/util/parse-connection'
import config from './config'

let connectionOptions = config.get('database.options')

if (config.has('database.url') && config.get('database.url')) {
	_.assign(connectionOptions, parseConnectionString(config.get('database.url')))
}

if (_.isEqual(connectionOptions, {})) {
	console.error("Looks like you haven't configured a database. Make sure to do it in local.json for your production settings") // eslint-disable-line quotes
	process.exit(1) // eslint-disable-line xo/no-process-exit
}

export default knex(connectionOptions)
