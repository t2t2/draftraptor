import {sequelize, DataTypes} from '../database'
import JSONDatatypeShiv from '../helpers/JSONDatatypeShiv'

export default sequelize.define('Team', {
	name:    {
		type:      DataTypes.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [2],
		},
	},
	authkey: {
		type:      DataTypes.STRING,
		allowNull: false,
		unique:    true,
		validate: {
			notEmpty: true,
			len: [2],
		},
	},
	color: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'white',
	},
	money:   {
		type:      DataTypes.INTEGER,
		allowNull: false,
	},
}, {
	classMethods: {
		associate: function (models) {
			this.hasMany(models.Item)
		},
	},
	transformer: function () {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			money: this.money,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	},
})
