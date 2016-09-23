import socketioProvider from 'feathers-socketio'

export default function () {
	const app = this

	app.configure(socketioProvider(callback))
}

function callback(io) {
	const app = this

	io.on('connection', socket => {
		// Delay check
		socket.on('time', (timestamp, callback) => {
			callback(timestamp, (new Date()).getTime())
		})

		socket.on('disconnect', async () => {
			const socketInfo = app._socketInfo
			// remove connection from users
			const params = socketInfo.params(socket)

			if (params.user && params.user.id) {
				try {
					await app.service('api/sessions').remove(params.user.id)
				} catch (err) {
					console.error('Error removing traces of old user', err)
				}
			}
		})
	})
}
