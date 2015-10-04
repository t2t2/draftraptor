import { sequelize } from '../database'

var models = require('require-dir')()

require('debug')('DKGS.models')('', Object.keys(models).join(', '))

// Set up associations
Object.keys(models).forEach(function (name) {
	if(models[name].associate) {
		models[name].associate(models)
	}
})

models.sequelize = sequelize

module.exports = models