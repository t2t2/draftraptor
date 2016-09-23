import auth from 'feathers-authentication'
import errors from 'feathers-errors'

export {disable, remove} from 'feathers-hooks'
export const populateUser = auth.hooks.populateUser
export const verifyToken = auth.hooks.verifyToken

export function restrictToAdmin() {
	return function (hook) {
		if ((!hook.params.user || !hook.params.user.admin) && hook.params.provider) {
			throw new errors.Forbidden('Requires admin permissions.')
		}
	}
}

export function restrictToPlayerOrAdmin() {
	return async function (hook) {
		if (!hook.params.user) {
			throw new errors.Forbidden('Must be logged in.')
		}

		if (hook.params.user.team_id) {
			const team = await hook.app.service('api/teams').get(hook.params.user.team_id)

			hook.team = team

			return
		}

		if (hook.params.user.admin) {
			return
		}

		throw new errors.Forbidden('Requires being on a team or admin permissions.')
	}
}

export function updateTimestamps() {
	return function (hook) {
		if (hook.method === 'create') {
			hook.data.created_at = new Date() // eslint-disable-line camelcase
		}

		hook.data.updated_at = new Date() // eslint-disable-line camelcase
	}
}

export function validate(schema) {
	return async function (hook) {
		try {
			hook.data = await schema.validate(hook.data, {
				context: hook
			})
		} catch (err) {
			if (err.name === 'ValidationError') {
				throw new errors.BadRequest('Validation error', {
					errors: err.errors
				})
			} else {
				console.log(err)
				throw err
			}
		}
	}
}
