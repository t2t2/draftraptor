import fs from 'fs'
import path from 'path'
import makeDebug from 'debug'
import nunjucks from 'nunjucks'
import config from '../config'

const debug = makeDebug('nunjucks')

const manifestLocation = path.join(__dirname, '../public/manifest.json')

export default function () {
	const app = this

	const dev = config.has('dev') && config.get('dev')

	const env = nunjucks.configure(path.join(__dirname, '../views'), {
		watch: dev,
		express: app
	})

	env.addGlobal('dev', dev)

	// Pretty dump
	env.addFilter('dump', obj => {
		return JSON.stringify(obj, null, '  ')
	})

	fs.exists(manifestLocation, exists => {
		let filter

		if (exists) {
			debug('assets: production')

			var mapping = fs.readFileSync(manifestLocation, {encoding: 'utf8'})
			mapping = JSON.parse(mapping)
			if (!mapping) {
				mapping = {}
			}

			filter = location => {
				location = mapping[location] ? mapping[location] : location
				return location.indexOf('/') === 0 ? location : '/' + location
			}
		} else {
			debug('assets: dev')

			filter = location => {
				return location.indexOf('/') === 0 ? location : '/' + location
			}
		}

		env.addFilter('asset', filter)
	})
}
