import connection from './connection'
import EventEmitter from 'events'
import Ultron from 'ultron'

import reduce from 'lodash/collection/reduce'

export default class extends EventEmitter {

	constructor(service, where = {}) {
		super()

		this.items = {}
		this.service = connection.service(service)
		this.ultron = new Ultron(this.service)
		this.where = where

		this.service.find({where: where}, (error, items) => {
			items.forEach((thing) => {
				this.items.$set(thing.id, thing)
			})
			this.emit('changed')
		})

		this.ultron.on('created', this.onItemCreated.bind(this))
		this.ultron.on('updated', this.onItemUpdated.bind(this))
		this.ultron.on('patched', this.onItemUpdated.bind(this))
		this.ultron.on('removed', this.onItemRemoved.bind(this))
	}

	_itemMatches(item) {
		return reduce(this.where, (matches, value, key) => {
			return matches && item[key] == value
		}, true)
	}

	onItemCreated(item) {
		if (this._itemMatches(item)) {
			this.items.$set(item.id, item)
		}
	}

	onItemUpdated(item) {
		if (this._itemMatches(item)) {
			this.items.$set(item.id, item)
		}
	}

	onItemRemoved(item) {
		if (this._itemMatches(item)) {
			this.items.$delete(item.id)
		}
	}

	destroy() {
		this.ultron.destroy()
		this.items = {}
		this.service = null
		this.ultron = null
		this.removeAllListeners()
	}
}