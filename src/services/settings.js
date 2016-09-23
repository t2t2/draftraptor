import service from 'feathers-knex'
import yup from 'yup'
import knex from '../database'
import {disable, populateUser, restrictToAdmin, verifyToken, updateTimestamps, validate} from '../hooks'

const schema = yup.object().shape({
	money: yup.number()
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.min(1),
	timer: yup.number()
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.positive(),
	start_timer: yup.number() // eslint-disable-line camelcase
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.positive()
})

export default function () {
	const app = this

	app.service('api/settings', service({
		Model: knex,
		name: 'settings'
	}))

	const settingsService = app.service('api/settings')

	settingsService.before({
		create: disable(),
		update: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		patch: [verifyToken(), populateUser(), restrictToAdmin(), validate(schema), updateTimestamps()],
		remove: disable()
	})
}

