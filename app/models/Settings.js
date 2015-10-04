import {sequelize, DataTypes} from '../database'
import JSONDatatypeShiv from '../helpers/JSONDatatypeShiv'

export default sequelize.define('Settings', {
	money:   {
		type:         DataTypes.INTEGER,
		allowNull:    false,
		defaultValue: 100,
	},
	timer:   {
		type:         DataTypes.INTEGER,
		allowNull:    false,
		defaultValue: 15,
	},
	startTimer: {
		type:         DataTypes.INTEGER,
		allowNull:    true,
		defaultValue: 5,
	},
}, {
	classMethods: {
		associate: function (models) {
			this.belongsTo(models.Item)
		},
	},
})
