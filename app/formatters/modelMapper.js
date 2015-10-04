import _ from 'lodash'

import SequelizeInstance from 'sequelize/lib/instance'

export default function modelMapper (instance) {
	if(_.isArray(instance)) {
		return _.map(instance, modelMapper)
	}

	if(instance instanceof SequelizeInstance) {
		// Structure gotten from toJSON -> transformer
		// @TODO relations
	}

	return instance
}