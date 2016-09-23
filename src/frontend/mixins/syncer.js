import eventBus from '../event-bus'

export default {
	events: {
		'syncer-error'(path, err) {
			eventBus.serviceError(err, path)
		}
	}
}
