import path from 'path'

import errors from 'feathers-errors/handler'
import feathers from 'feathers'

export function before() {
	const app = this

	app.use(feathers.static(path.resolve(__dirname, '../public')))
}

export function after() {
	const app = this

	app.use(errors({
		html: errorRenderer
	}))
}

// Error renderer for html responses
function errorRenderer(error, req, res) {
	res.render('errors/default.html', {
		error
	})
}

