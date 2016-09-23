import service from 'feathers-knex'
import yup from 'yup'
import knex from '../database'
import {populateUser, restrictToAdmin, verifyToken, updateTimestamps, validate} from '../hooks'

const schema = yup.object().shape({
	name: yup.string()
		.when('$method', {
			is: 'patch',
			otherwise: yup.string().required()
		}),
	team_id: yup.number() // eslint-disable-line camelcase
		.nullable()
		.integer()
		.test('team_id', '${path} must be a team', async function(value) {
			if (value === null || value === undefined) {
				return true
			}

			console.log(value, this.options.context)

			const result = await knex('teams').where('id', value).first()

			return Boolean(result)
		}),
	sold: yup.number()
		.integer(),
	start_time: yup.date() // eslint-disable-line camelcase
		.nullable(),
	min_end_time: yup.date() // eslint-disable-line camelcase
		.nullable()
})

export default function () {
	const app = this

	app.service('api/items', service({
		Model: knex,
		name: 'items'
	}))

	const itemsService = app.service('api/items')

	itemsService.before({
		create: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		update: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		patch: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		remove: [verifyToken(), populateUser(), restrictToAdmin()]
	})
}
