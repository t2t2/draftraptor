import service from 'feathers-knex'
import yup from 'yup'

import knex from '../database'
import {populateUser, remove, restrictToAdmin, verifyToken, updateTimestamps, validate} from '../hooks'

const schema = yup.object().shape({
	name: yup.string()
		.when('$method', {
			is: 'patch',
			otherwise: yup.string().required()
		})
		.min(2),
	auth_key: yup.string() // eslint-disable-line camelcase
		.when('$method', {
			is: 'patch',
			otherwise: yup.string().required()
		})
		.min(2)
		.test('unique', '${path} must be unique', async function (value) {
			if (value === undefined) {
				return true
			}
			const context = this.options.context

			let request = knex('teams').where('auth_key', value)
			if (context.id) {
				request = request.whereNot('id', context.id)
			}
			const result = await request.first()

			return !result
		}),
	color: yup.string()
		.oneOf(['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
			'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'white']),
	money: yup.number()
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.positive()
})

export default function () {
	const app = this

	app.service('api/teams', service({
		Model: knex,
		name: 'teams'
	}))

	const teamsService = app.service('api/teams')

	teamsService.before({
		create: [verifyToken(), populateUser(), restrictToAdmin(), setDefaultMoney, validate(schema), updateTimestamps()],
		update: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		patch: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		remove: [verifyToken(), populateUser(), restrictToAdmin()]
	})

	teamsService.after(remove('auth_key'))
}

async function setDefaultMoney(hook) {
	if (!hook.data.money) {
		const settings = await hook.app.service('api/settings').get(1)

		hook.data.money = settings.money
	}
}
