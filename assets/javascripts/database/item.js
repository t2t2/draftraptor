import connection from './connection'
import EventEmitter from 'events'
import Ultron from 'ultron'

export default class extends EventEmitter {

	constructor(service, id) {
		super()

		this.id = id
		this.item = null
		this.service = connection.service(service)
		this.ultron = new Ultron(this.service)

		this.service.get(id, (error, item) => {
			this.item = item
			this.emit('changed')
		})

		this.ultron.on('updated', this.onItemUpdated.bind(this))
		this.ultron.on('patched', this.onItemUpdated.bind(this))
		this.ultron.on('removed', this.onItemRemoved.bind(this))
	}

	onItemCreated(item) {
		if(this.id == item.id) {
			this.item = item
			this.emit('changed')
		}
	}

	onItemUpdated(item) {
		if(this.id == item.id) {
			this.item = item
			this.emit('changed')
		}
	}

	onItemRemoved(item) {
		this.item = null
		this.emit('changed')
	}

	destroy() {
		this.ultron.destroy()
		this.item = null
		this.service = null
		this.ultron = null
		this.removeAllListeners()
	}
}