import moment from 'moment'
import Promise from 'bluebird'
import {Bid, Item, Settings, Team} from '../models'

import {Missing, Unauthorized} from '../errors'

import CurrentUserIsAdmin from '../filters/CurrentUserIsAdmin.js'
import GetCurrentSettings from '../filters/GetCurrentSettings.js'

export var events = []

function getBidById({ id }) {
	return Bid.findById(id)
}

export var find = [
	function ({ params: { query: { where = {} }}}) {

		return Bid.findAll({
			where: where,
		})
	}
]

export var get = [
	getBidById
]

export var create = [
	function ({ data, params }) {
		if (!params.team) {
			throw new Unauthorized('User must log into a team')
		}

		data.amount = parseInt(data.amount, 10)
		// Save bid receive time
		data.bidTime = new Date()

		return Promise.props({
			settings: Settings.findById(1),
			team:     Team.findById(params.team),
		}).then(({ settings, team }) => {
			if (!settings.ItemId) {
				throw new Missing('No open auction')
			}
			if (!team) {
				throw new Unauthorized('User must log into a team')
			}

			// If not enough money
			if(data.amount > team.money) {
				throw new Unauthorized("Team doesn't have enough money")
			}

			// Save target IDs
			data.TeamId = team.id
			data.ItemId = settings.ItemId

			return Promise.props({
				settings: settings,
				team:     team,
				item:     Item.findById(settings.ItemId),
				bestBid:  Bid.findOne({
					where: {
						ItemId: settings.ItemId
					},
					order: [['amount', 'DESC']]
				}),
			})
		}).then(({ settings, team, item, bestBid }) => {
			// Check that in time
			if(item.startTime && moment(item.startTime).isAfter(data.bidTime)) {
				throw new Unauthorized('Bid is too early')
			}

			var mustBeBefore = null
			if(bestBid && bestBid.bidTime) {
				mustBeBefore = moment(bestBid.bidTime).add(settings.timer, 's')
			}
			if(item.minEndTime) {
				var minEndTime = moment(item.minEndTime)
				if(mustBeBefore && mustBeBefore.isBefore(minEndTime)) {
					mustBeBefore = minEndTime
				} else {
					mustBeBefore = minEndTime
				}
			}
			if(mustBeBefore && mustBeBefore.isBefore(data.bidTime)) {
				throw new Unauthorized('Bid is too late (' + Math.abs(mustBeBefore.diff(data.bidTime, 'ms')) + 'ms)')
			}

			if(bestBid && bestBid.amount >= data.amount) {
				throw new Unauthorized('Bid is too small (' + bestBid.amount + ')')
			}
		})
	},
	function ({ data }) {
		return Bid.create(data, {
			fields: ['amount', 'bidTime', 'TeamId', 'ItemId']
		})
	}
]


export var patch = [
	CurrentUserIsAdmin,
	getBidById,
	function ({ data, result: bid }) {
		return bid.update(data, {
			fields: ['amount', 'bidTime', 'TeamId', 'ItemId']
		})
	}
]

export var remove = [
	CurrentUserIsAdmin,
	getBidById,
	function ({ data, result: bid }) {
		return bid.destroy().then(() => {
			return bid // needed by feathers
		})
	}
]