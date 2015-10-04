import connection from '../database/connection'
import Collection from '../database/collection'
import Item from '../database/item'

export default {
	computed: {
		connectionState: function () {
			return this.connection ? 'connected' : this.reconnecting ? 'connecting' : 'disconnected';
		}
	},

	data: function () {
		return {
			connection:       false,
			connectionGiveUp: false,
			reconnecting:     false,
			ping:             0,
			serverOffset:     0,
			isAdmin:          false,
			isTeam:           false,
		}
	},

	methods: {
		reconnect: function () {
			this.connection = false
			this.reconnecting = false
			this.connectionGiveUp = false
			this.$feathers._socket.connect()
		},
	},

	ready: function () {
		this.$feathers = {
			_client: connection.feathers,
			_cleans: [],
			_codes:  [],
			_socket: connection.io,
			_username: '',
			login:   doLogin.bind(this),
		}

		bindConnectionEents.call(this, connection.io)
	},

	destroyed: function () {
		this.$feathers._cleans.map(function (cleaner) {
			cleaner()
		})
	}
}

function bindConnectionEents(client) {
	function setConnectionState(connection, reconnecting) {
		this.connection = connection
		this.reconnecting = reconnecting
		this.ping = 0
	}

	client.on('connect', setConnectionState.bind(this, true, false))
	client.on('reconnect', setConnectionState.bind(this, true, false))
	client.on('disconnect', setConnectionState.bind(this, false, false))
	client.on('reconnect_error', setConnectionState.bind(this, false, false))
	client.on('reconnecting', setConnectionState.bind(this, false, true))
	client.on('reconnect_failed', () => {
		console.log('Given Up')
		setConnectionState.call(this, true, false)
		this.connectionGiveUp = true
	})

	client.on('connect', () => {
		client.emit('time', (new Date).getTime(), (requested, server) => {
			let local = (new Date).getTime()

			let {ping, offset} = calculatePingAndOffset(requested, server, local)

			this.ping = ping
			this.serverOffset = offset
		})
	})
	client.on('reconnect', () => {
		// Relog using allowed keys
		if(this.$feathers._codes.length > 0) {
			this.$feathers._socket.emit('login', {
				username:   this.$feathers._username,
				accessCode: this.$feathers._codes
			}, (errors, result) => {
				if(errors) { // None matched
					this.$feathers._codes = []
				}
				this.$feathers._username = result.admin
				this.isAdmin = result.admin
				this.isTeam = result.team
			})
		}
	})

	// Timer
	var interval = setInterval(() => {
		if (client.disconnected) {
			return
		}
		client.emit('time', (new Date).getTime(), (requested, server) => {
			let local = (new Date).getTime()

			let {ping, offset} = calculatePingAndOffset(requested, server, local)
			this.ping = Math.ceil((this.ping * 4 + ping) / 5)
			this.serverOffset = Math.ceil((this.serverOffset * 4 + offset) / 5)
		})
	}, 15000)
	this.$feathers._cleans.push(function () {
		clearInterval(interval)
	})
}

function calculatePingAndOffset(requested, server, local) {
	var ping = Math.ceil((local - requested) / 2),
		offset = server - (local - ping)

	return {ping, offset}
}

function doLogin(username, accessCode, callback) {
	this.$feathers._socket.emit('login', {
		username:   username,
		accessCode: accessCode
	}, (errors, result) => {
		if (errors) {
			return callback(errors)
		}

		this.$feathers._codes.push(accessCode)
		this.$feathers._username = result.username
		this.isAdmin = result.admin
		this.isTeam = result.team
		return callback(errors, result)
	})
}