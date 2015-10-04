import {Settings} from '../models'

import CurrentUserIsAdmin from '../filters/CurrentUserIsAdmin.js'

export var events = [ 'log' ]

function getSettingsById({ id }) {
	return Settings.findById(id)
}

export var get = [
	getSettingsById,
]

export var patch = [
	CurrentUserIsAdmin,
	getSettingsById,
	function({ data, result: settings }) {
		return settings.update(data, {
			fields: ['money', 'timer', 'startTimer', 'overbid', 'ItemId'],
		})
	}
]