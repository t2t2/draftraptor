import _ from 'lodash'

import modelMapper from './modelMapper'

export default function (req, res) {
	res.format({
		'application/json': function () {
			var data = res.data

			if (_.isObject(data)) {
				data = modelMapper(data)
			}

			res.json({data: data})
		}
	})
}

export function ApiError(err, req, res, next) {
	res.format({
		'application/json': function () {
			res.status(err.code || 500).json({errors: {message: err.message || err}})
		}
	})
}

import {Missing} from '../errors'

export function Api404(req, res, next) {
	next(new Missing('Not Found'))
}