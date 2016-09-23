import bodyParser from 'body-parser'
import makeDebug from 'debug'
import feathers from 'feathers'
import hooks from 'feathers-hooks'
import rest from 'feathers-rest'

import authentication from './server/auth'
import {before as beforeMiddleware, after as afterMiddleware} from './server/middleware'
import config from './config'
import database from './database'
import nunjucks from './server/nunjucks'
import routes from './server/routes'
import services from './server/services'
import sockets from './server/socket'

const debug = makeDebug('draftraptor:app')

export default async function () {
	await ensureDatabase()

	const app = feathers()

	app.configure(nunjucks)

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({
		extended: true
	}))

	app.configure(hooks())
	app.configure(rest())
	app.configure(sockets)

	app.configure(beforeMiddleware)

	app.configure(authentication)

	app.configure(routes)
	app.configure(services)

	app.configure(afterMiddleware)

	app.start = startServer

	return app
}

async function ensureDatabase() {
	if (await database.migrate.currentVersion() === 'none') {
		throw new Error('Database seems to be misconfigured')
	}
}

function startServer() {
	return new Promise(resolve => {
		const port = config.get('port')
		this.listen(port, () => {
			debug(`Listening on port ${port}`)
			resolve()
		})
	})
}
