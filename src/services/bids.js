import _ from 'lodash'
import moment from 'moment'
import service from 'feathers-knex'
import yup from 'yup'

import knex from '../database'
import {populateUser, restrictToPlayerOrAdmin, restrictToAdmin, verifyToken, updateTimestamps, validate} from '../hooks'

const schema = yup.object().shape({
	item_id: yup.number() // eslint-disable-line camelcase
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.when('$method', {
			is: 'create',
			then: yup.number().test('current_auction', 'Must be bid on the current auction', function (value) {
				const context = this.options.context

				const settings = context.settings

				return value === settings.item_id || context.params.user.admin
			})
		}),
	team_id: yup.number() // eslint-disable-line camelcase
		.integer()
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.test('exists', 'Team must exist', async function (value) {
			if (value === undefined) {
				return true
			}
			const context = this.options.context

			// if has team hooked then all ok
			if (context.team && context.team.id === value) {
				return true
			}

			return Boolean(await context.app.service('api/teams').get(value))
		})
		.test('own', 'Team isn\'t yours', function (value) {
			if (value === undefined) {
				return true
			}
			const context = this.options.context

			if (context.params.user.admin) {
				return true
			}

			return context.params.user.team_id === value
		}),
	amount: yup.number() // eslint-disable-line camelcase
		.integer()
		.min(1)
		.max(yup.ref('$settings.money'))
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.when('$method', {
			is: 'create',
			then: yup.number()
				.test('enough_money', 'Team doesn\'t have enough money', function (value) {
					const context = this.options.context

					const team = context.team

					return value <= team.money
				})
				.test('bigger_than_last', 'Bid must be better than last bid', function (value) {
					const context = this.options.context
					const {lastBid, settings} = context

					if (lastBid === undefined) {
						throw this.createError({
							message: 'This should not have happened'
						})
					}

					if (lastBid && lastBid.amount >= value && value < settings.money) {
						throw this.createError({
							message: `Bid is too small (${lastBid.amount})`
						})
					}

					return true
				})
		}),
	bid_time: yup.date() // eslint-disable-line camelcase
		.when('$method', {
			is: 'patch',
			otherwise: yup.date().required()
		})
		.when('$method', {
			is: 'create',
			then: yup.date()
				.test('bidding_ongoing', 'Bidding isn\'t going on', function (value) {
					const context = this.options.context

					const {item, lastBid, settings} = context

					const valueMoment = moment(value)

					// Isn't too early
					if (valueMoment.isBefore(item.start_time)) {
						throw this.createError({
							message: 'Bidding isn\'t open yet'
						})
					}

					// Is too late
					let biddingEnds = null
					if (lastBid) {
						biddingEnds = moment(lastBid.bid_time).add(settings.timer, 's')
					}
					if (item.min_end_time) {
						const minEndTime = moment(item.min_end_time)
						if (!biddingEnds || biddingEnds.isBefore(minEndTime)) {
							biddingEnds = minEndTime
						}
					}

					if (biddingEnds && valueMoment.isAfter(biddingEnds)) {
						throw this.createError({
							message: 'Bidding has ended'
						})
					}

					return true
				})
		}),
	username: yup.string(),
	share: yup.number()
		.integer()
		.min(1)
		.max(100)
		.when('$method', {
			is: 'patch',
			otherwise: yup.number().required()
		})
		.when(['amount', '$settings.money'], {
			is: function (bid, money) {
				return bid === money
			},
			then: yup.number()
				.test('less_than_last', function (value) {
					if (value === undefined) {
						return true
					}

					const {lastBid} = this.options.context
					if (lastBid && value >= lastBid.share && lastBid.amount === this.parent.amount) {
						throw this.createError({
							message: `Share must be lower than previous bid (${lastBid.share}%)`
						})
					}
					return true
				}),
			otherwise: yup.number().equals([100], 'You can only adjust the share at max bid')
		})
})

export default function () {
	const app = this

	app.service('api/bids', service({
		Model: knex,
		name: 'bids'
	}))

	const bidsService = app.service('api/bids')

	bidsService.before({
		create: [verifyToken(), populateUser(), restrictToPlayerOrAdmin(), setDefaultValues(), populateHookObject(), validate(schema), updateTimestamps()],
		update: [verifyToken(), populateUser(), restrictToAdmin(), populateHookObject(), validate(schema), updateTimestamps()],
		patch: [verifyToken(), populateUser(), restrictToAdmin(), populateHookObject(), validate(schema), updateTimestamps()],
		remove: [verifyToken(), populateUser(), restrictToAdmin()]
	})
}

function setDefaultValues() {
	return async function (hook) {
		const settings = hook.settings = await hook.app.service('api/settings').get(1)

		hook.data.bid_time = new Date() // eslint-disable-line camelcase

		if (hook.data.team_id === undefined && hook.team) {
			hook.data.team_id = hook.team.id // eslint-disable-line camelcase
		} else if (hook.data.team_id) {
			hook.team = await hook.app.service('api/teams').get(hook.data.team_id)
		}

		hook.data.item_id = settings.item_id // eslint-disable-line camelcase

		if (hook.data.share === undefined) {
			hook.data.share = 100
		}

		hook.data.username = hook.params.user.username
	}
}

function populateHookObject() {
	return async function (hook) {
		let data = hook.data
		if (hook.method === 'patch') { // Get current data
			if (hook.id) {
				data = _.assign({}, await hook.app.service('api/bids').get(hook.id), hook.data)
			} else {
				throw new Error('No patching multiple things')
			}
		}

		// Populate hook with data for validation
		await Promise.all([
			Promise.resolve(hook.item).then(async item => {
				if (!item) {
					hook.item = await hook.app.service('api/items').get(hook.data.item_id)
				}
			}),
			Promise.resolve(hook.lastBid).then(async lastBid => {
				if (lastBid === undefined) {
					const query = {
						item_id: hook.data.item_id, // eslint-disable-line camelcase
						$sort: {
							id: -1
						},
						$limit: 1
					}
					if (hook.id) {
						query.id = {$lt: hook.id}
					}
					const lastBids = await hook.app.service('api/bids').find({
						query
					})

					if (lastBids.length) {
						hook.lastBid = lastBids[0]
					} else {
						hook.lastBid = null
					}
				}
			}),
			Promise.resolve(hook.settings).then(async settings => {
				if (!settings) {
					hook.settings = await hook.app.service('api/settings').get(1)
				}
			}),
			Promise.resolve(hook.team).then(async team => {
				if (!team || data.team_id !== team.id) {
					hook.team = await hook.app.service('api/teams').get(data.team_id)
				}
			})
		])
	}
}
