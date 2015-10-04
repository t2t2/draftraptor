import EventEmitter from 'events'
import feathers from 'feathers-client'
import socketio from 'socket.io-client'

class Client extends EventEmitter {

	constructor(target) {
		super()

		this.feathers = feathers(target)
		this.io = socketio(target)
		this.feathers.configure(feathers.socketio(this.io))
	}

	service(name) {
		return this.feathers.service('api/' + name)
	}


}

var target = location.protocol + '//' + location.host + '/'

export default new Client(target)
