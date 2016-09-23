import authentication from 'feathers-authentication'
import errors from 'feathers-errors'
import config from '../config'
import {verifyToken, populateUser} from '../hooks'

// based on https://github.com/feathersjs/feathers-authentication/blob/v0.5.1/src/services/local/index.js
class LocalAuthService {
	setup(app) {
		this.app = app

		// prevent regular service events from being dispatched
		if (typeof this.filter === 'function') {
			this.filter(() => false)
		}
	}

	async create(data, params) {
		const app = this.app

		console.log(params)

		if (!data.code || data.code.length < 0) {
			throw new errors.BadRequest('Missing code')
		}
		if (!data.username || data.username.length < 0) {
			throw new errors.BadRequest('Missing username')
		}

		const result = await this.findByCode(data.code)

		if (!result) {
			throw new errors.NotAuthenticated('Invalid login.')
		}

		// Check for current session
		let session = null
		if (params.user) {
			session = params.user
		}

		const newData = {
			username: data.username,
			team_id: session ? session.team_id : null, // eslint-disable-line camelcase
			admin: session ? session.admin : false
		}
		if (result.team) {
			newData.team_id = result.team.id // eslint-disable-line camelcase
		}
		if (result.admin) {
			newData.admin = result.admin
		}

		if (session) {
			session = await app.service('api/sessions').patch(session.id, newData)
		} else {
			session = await app.service('api/sessions').create(newData)
		}

		return await app.service('auth/token').create(session, {
			internal: true
		})
	}

	async findByCode(code) {
		if (config.has('password') && config.get('password') === code) {
			return {
				admin: true
			}
		}

		// Check teams
		const team = await this.app.service('api/teams').find({
			query: {
				auth_key: code // eslint-disable-line camelcase
			}
		})
		if (team.length) {
			return {
				team: team[0]
			}
		}

		// Nope
		return false
	}

}

export default function () {
	const app = this

	app.configure(authentication({
		setUpSuccessRedirect: false,
		setUpFailureRedirect: false,
		local: false, // replaced by custom
		token: {
			secret: config.get('key')
		},
		userEndpoint: 'api/sessions',
		idField: 'id'
	}))

	// No passport methods are used so feathers objects can be cleaned up from the extra crap
	const _super = app.setup

	app.setup = function () {
		let result = _super.apply(this, arguments)

		if (app.io) {
			// Replace feathers-auth listener
			app.io.on('connection', socket => {
				delete socket.feathers.req
			})
		}

		return result
	}

	app.use('/auth/local', new LocalAuthService())
	const localAuth = app.service('auth/local')

	// Provide current auth for overwriting
	localAuth.before({
		create: [softVerifyToken(), populateUser()]
	})
}

function softVerifyToken(options) {
	const verifier = verifyToken(options)

	return async function (hook) {
		try {
			return await verifier.call(this, hook)
		} catch (err) {
			if (err.message === 'Authentication token missing.') {
				return
			}
			throw err
		}
	}
}
