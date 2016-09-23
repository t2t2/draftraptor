import cloneDeep from 'lodash/cloneDeep'

export default {
	data() {
		return {
			connection: {
				connected: false,
				latency: 0,
				offset: 0,
				reason: 'Connecting...',
				user: null
			}
		}
	},
	ready() {
		// hook into feathers client
		const socket = this.$feathers.io

		// Take the current user
		const that = this
		const oldSet = this.$feathers.set
		this.$feathers.set = function (...args) {
			if (args[0] === 'user') {
				that.connection.user = cloneDeep(args[1])
			}
			oldSet.apply(this, args)
		}

		socket.on('connect', () => {
			this.connection.connected = true
			this.connection.reason = ''

			if (this.$feathers.get('token')) {
				this.$feathers.authenticate().then(result => {
					this.connection.user = cloneDeep(result.data)
				}).catch(() => {
					this.connection.user = null
				})
			}

			// initial state
			socket.emit('time', (new Date()).getTime(), (requested, server) => {
				const local = (new Date()).getTime()

				let {ping, offset} = calculatePingAndOffset(requested, server, local)

				this.connection.latency = ping
				this.connection.offset = offset
			})
		})

		socket.on('connect_error', reason => {
			this.connection.connected = false
			this.connection.reason = `Couldn't connect (${reason})`
		})

		socket.on('connect_timeout', time => {
			const formattedTime = Math.round(time / 1000)

			this.connection.connected = false
			this.connection.reason = `Connection timed out (${formattedTime}s)`
		})

		socket.on('reconnecting', attempt => {
			this.connection.connected = false
			this.connection.reason = `Reconnecting... (${attempt})`
		})

		socket.on('reconnect_failed', () => {
			this.connection.connected = false
			this.connection.reason = `Connection failed, try again later`
		})

		// Timer
		this._pingInterval = setInterval(() => {
			if (socket.disconnected) {
				return
			}

			socket.emit('time', (new Date()).getTime(), (requested, server) => {
				const local = (new Date()).getTime()

				let {ping, offset} = calculatePingAndOffset(requested, server, local)

				// Average it out over time
				this.connection.latency = Math.ceil(((this.connection.latency * 4) + ping) / 5)
				this.connection.offset = Math.ceil(((this.connection.offset * 4) + offset) / 5)
			})
		}, 20 * 1000)
	},
	beforeDestroy() {
		clearInterval(this._pingInterval)
	}
}

function calculatePingAndOffset(requested, server, local) {
	const ping = Math.ceil((local - requested) / 2)
	const offset = server - (local - ping)

	return {ping, offset}
}
