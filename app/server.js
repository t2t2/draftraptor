var argv = require('minimist')(process.argv.slice(2)),
	path = require('path')

import bodyParser from 'body-parser'
import feathers from 'feathers'

var app = feathers()

// Enable nunjucks
import nunjucks from 'nunjucks'
import nunjucksFilters from './helpers/nunjucksFilters.js'

var env = nunjucks.configure(path.join(__dirname, 'views'), {
	autoescape: true,
	express: app,
})
nunjucksFilters(env)

// Add reducer mixin
import ReducerMixin from './mixins/reducer'
app.mixins.unshift(ReducerMixin)

import RestFormatter, {ApiError, Api404} from './formatters/rest'
import SocketIOFormatter from './formatters/socketio'
app.configure(feathers.rest(RestFormatter))
app.configure(feathers.socketio(SocketIOFormatter))
app.use(bodyParser.json())


// Register services
var services = require('require-dir')('./services')
Object.keys(services).map((name) => {
	app.service('/api/' + name, services[name])
})

app.use('/api/', Api404)
app.use('/api/', ApiError)

app.use('/', feathers.static(path.join(__dirname, '../public')))

app.get('*', function (req, res) {
	res.render('index.html')
})

import {sequelize, Settings} from './models'

sequelize.sync({
	// Uncomment this if you need to change schema (destroys everything)
//	force: true,
	logging: require('debug')('sequelize'),
}).then(function () {
	// Make sure settings state exists
	return Settings.findById(1).then(function (settings) {
		if(!settings) {
			// Creates settings
			return Settings.create({ id: 1 })
		}
	})
}).then(function () {
	app.listen(process.env.PORT || argv.p || 8000, function () {
		console.log('Server is now running')
	})
}).catch(function (err) {
	console.error('Error:', err)
})

export default app