import {sequelize, DataTypes} from '../database'

export default sequelize.define('Item', {
	name:      {
		type:      DataTypes.STRING,
		allowNull: false
	},
	sold:      {
		type:      DataTypes.INTEGER,
		allowNull: true,
	},
	startTime: {
		type: DataTypes.DATE
	},
	minEndTime: {
		type: DataTypes.DATE
	},
}, {
	classMethods: {
		associate: function (models) {
			this.belongsTo(models.Team)
		},
	},
})
