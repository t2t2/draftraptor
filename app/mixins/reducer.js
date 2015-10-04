import _ from 'lodash'
import Promise from 'bluebird'

export default function (service) {
	if (typeof service.mixin === 'function') {
		var mixin = {}

		_.each(this.methods, function (method) {
			// Convert reducers into a function
			if (_.isArray(service[method])) {

				var stack = service[method]

				mixin[method] = function () {
					var callback = arguments[arguments.length - 1]
					var state = getState(method, arguments)

					return Promise.reduce(stack, function (state, action) {
						if(action.length <= 1) { // One arg
							return Promise.try(action, state, service).then(function (result) {
								if (result !== undefined) {
									state.result = result
								}
								return state
							})
						}
					}, state).then(function (state) {
						if('result' in state) {
							return state.result
						}
					}).catch(function (error) {
						var result = {};
						Object.getOwnPropertyNames(error).forEach(function (key) {
							if(key == 'stack') return;
							return result[key] = error[key];
						});
						throw result;
					})
				}

			}
		})

		service.mixin(mixin)
	}
}

function getState(method, args) {
	return converters[method](args)
}

var converters = {
	find(args) {
		return {
			params: args[0]
		}
	},
	create (args) {
		return {
			data:   args[0],
			params: args[1],
		}
	},
	get:    getOrRemove,
	update: updateOrPatch,
	patch:  updateOrPatch,
	remove: getOrRemove,
}

function getOrRemove(args) {
	return {
		id:     args[0],
		params: args[1],
	}
}

function updateOrPatch(args) {
	return {
		id:     args[0],
		data:   args[1],
		params: args[2],
	}
}