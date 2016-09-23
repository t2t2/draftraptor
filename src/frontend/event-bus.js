import EventEmitter from 'events'

class AppEventBus extends EventEmitter {

	notify(...args) {
		this.emit('notify', ...args)
	}

	serviceError(error, ...extra) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(...extra, error)
		}

		let errorObj = {
			type: 'alert'
		}

		if ('message' in error) {
			errorObj.title = error.message
		}

		if ('errors' in error) {
			if (Array.isArray(error.errors)) {
				errorObj.message = error.errors.map(error => {
					if (typeof error === 'string') {
						return error
					}
					return error.message
				}).join('\n')
			}
		}

		this.notify(errorObj)
		console.log(errorObj, error.errors)
	}
}

export default new AppEventBus()
