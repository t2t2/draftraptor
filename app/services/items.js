import {Item} from '../models'

import CurrentUserIsAdmin from '../filters/CurrentUserIsAdmin.js'
import GetCurrentSettings from '../filters/GetCurrentSettings.js'

export var events = []

function getItemById({ id }) {
	return Item.findById(id)
}

export var find = [
	function () {
		return Item.all()
	}
]

export var get = [
	getItemById
]

export var create = [
	CurrentUserIsAdmin,
	function ({ data }) {
		return Item.create(data, {
			fields: ['name', 'sold', 'startTime', 'minEndTime', 'TeamId']
		})
	}
]

export var patch = [
	CurrentUserIsAdmin,
	getItemById,
	function ({ data, result: item }) {
		return item.update(data, {
			fields: ['name', 'sold', 'startTime', 'minEndTime', 'TeamId']
		})
	}
]

export var remove = [
	CurrentUserIsAdmin,
	getItemById,
	function ({ data, result: item }) {
		return item.destroy().then(() => {
			return item // needed by feathers
		})
	}
]