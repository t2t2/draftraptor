import service from 'feathers-knex'
import knex from '../database'
import {disable, populateUser, restrictToAdmin, verifyToken, updateTimestamps} from '../hooks'

export default function () {
	const app = this

	app.service('api/sessions', service({
		Model: knex,
		name: 'sessions'
	}))

	const sessionsService = app.service('api/sessions')

	sessionsService.before({
		create: [disable('external'), updateTimestamps()],
		update: [disable('external'), updateTimestamps()],
		patch: [disable('external'), updateTimestamps()],
		remove: [verifyToken(), populateUser(), restrictToAdmin()]
	})
}
