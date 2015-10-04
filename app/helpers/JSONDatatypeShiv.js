import {DataTypes, sequelize} from '../database'

export default function (field, options = {}) {
	if(sequelize.options.dialect == 'postgres') {
		options.type = DataTypes.JSONB
	} else {
		options.type = DataTypes.TEXT
		options.get = function () {
			return JSON.parse(this.getDataValue(field))
		}
		options.set = function (value) {
			return this.setDataValue(field, JSON.stringify(value))
		}
		if(options.defaultValue) {
			options.defaultValue = JSON.stringify(options.defaultValue)
		}
	}
	return options
}