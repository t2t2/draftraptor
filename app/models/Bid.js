import {sequelize, DataTypes} from '../database'

export default sequelize.define('Bid', {
	amount:      {
		type:      DataTypes.INTEGER,
		allowNull: true,
	},
	bidTime: {
		type: DataTypes.DATE
	},
}, {
	classMethods: {
		associate: function (models) {
			this.belongsTo(models.Item)
			this.belongsTo(models.Team)
		},
	},
})
