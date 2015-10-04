import _ from 'lodash'
import config from '../config'
import Promise from 'bluebird'
import { Team } from '../models'

export default function (io) {

	io.use(function (socket, next) {
		socket.feathers = _.extend({username: null, admin: false, team: false})

		next()
	})

	io.sockets.on('connection', function (socket) {
		socket.on('time', function (timestamp, callback) {
			callback(timestamp, (new Date).getTime())
		})

		socket.on('login', function ({username, accessCode}, callback) {
			if (!_.isArray(accessCode)) {
				accessCode = [accessCode]
			}

			Promise.reduce(accessCode, function (success, accessCode) {
				if (config.password && accessCode == config.password) {
					socket.feathers.admin = true
					return true
				}

				return Team.findOne({
					where: {
						authkey: accessCode,
					}
				}).then((team) => {
					if(team) {
						socket.feathers.team = team.id
						return true
					}

					return success
				})

			}, false).then((success) => {
				if (success) {
					socket.feathers.username = username
					return callback(null, {
						username: socket.feathers.username,
						admin:    socket.feathers.admin,
						team:     socket.feathers.team
					})
				} else {
					return callback({error: 'Invalid access code'}, {
						username: socket.feathers.username,
						admin:    socket.feathers.admin,
						team:     socket.feathers.team
					})
				}
			})
		})
	})
}