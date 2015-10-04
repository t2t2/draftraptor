import {Team} from '../models'

import CurrentUserIsAdmin from '../filters/CurrentUserIsAdmin.js'
import GetCurrentSettings from '../filters/GetCurrentSettings.js'

export var events = []

function getTeamById({ id }) {
	return Team.findById(id)
}

export var find = [
	function () {
		return Team.all()
	}
]

export var get = [
	getTeamById
]

export var create = [
	CurrentUserIsAdmin,
	GetCurrentSettings,
	function ({ data, result: settings}) {
		data.money = settings.money

		return Team.create(data, {
			fields: ['name', 'authkey', 'color', 'money']
		})
	}
]

export var patch = [
	CurrentUserIsAdmin,
	getTeamById,
	function ({ data, result: team }) {
		return team.update(data, {
			fields: ['name', 'authekey', 'color', 'money']
		})
	}
]

export var remove = [
	CurrentUserIsAdmin,
	getTeamById,
	function ({ data, result: team }) {
		return team.destroy().then(() => {
			return team // needed by feathers
		})
	}
]