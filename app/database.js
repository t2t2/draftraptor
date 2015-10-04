import _ from 'lodash'
import config from './config'
import Sequelize from 'sequelize'

var connection;
if(config.database.url) {
	connection = new Sequelize(
		config.database.url,
		_.defaultsDeep(config.database.options, {logging: require('debug')('sequelize')})
	);
} else {
	connection = new Sequelize(
		config.database.name,
		config.database.username,
		config.database.password,
		_.defaultsDeep(config.database.options, {logging: require('debug')('sequelize')})
	);
}

export var sequelize = connection

export var DataTypes = require('sequelize/lib/data-types')

// Allow for using a transformer function for model JSON format
// Based on https://github.com/mickhansen/ssacl-attribute-roles

Sequelize.Instance.prototype.toJSON = function (key, options) {
	if ('transformer' in this.Model.options) {
		return this.Model.options.transformer.call(this)
	}

	return this.get({
		plain: true
	});
}