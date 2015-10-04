<template>
<div class="current-auction">
	<div class="current-auction-info">
		<h2 v-text="item.name"></h2>
	</div>
	<div class="grid-block">
		<div class="grid-block medium-8 current-bid vertical">
			<div class="grid-content shrink">
				<h5>Current bids</h5>
			</div>
			<ol class="bid-list grid-block">
				<li class="bid" v-repeat="bid in bids | orderBy 'amount' -1"
				    v-class="'team-background-' + teams[bid.TeamId].color">
					<div class="team">
						{{teams[bid.TeamId].name}}<br/>
						@ {{ bid.bidTime | formatTime }}
					</div>
					<div class="amount" v-text="bid.amount"></div>
					<button v-if="isAdmin" class="button alert shrink" v-on="click: removeBid(bid.id)">
						<i class="material-icons">close</i>
					</button>
				</li>
			</ol>
		</div>
		<div class="grid-block medium-4 vertical">
			<div class="shrink grid-block auction-time">
				<div class="grid-content text-right" v-text="biddingStarted ? 'Time to bid:' : 'Time to open:'"></div>
				<timer now="{{now}}" target-time="{{biddingStarted ? biddingEndingTime : biddingStartTime}}"></timer>
			</div>
			<div class="auction-bid" v-if="isTeam">
				<div class="alert-box alert" v-repeat="error in bidErrors" v-text="error"></div>
				<label>
					Bid
					<span class="inline-label">
						<input type="number" v-model="bid" min="0" max="{{maximumTeamBid}}"
						       v-on="keyup: sendBid | key 'enter'"/>
						<span class="form-label" v-text="'/ ' + maximumTeamBid"></span>
						<button class="button" v-on="click: sendBid" v-attr="disabled: sendingBid">Bid!</button>
					</span>
				</label>
			</div>
			<div class="auction-admin" v-if="isAdmin">
				<button class="button success expand" v-on="click: confirmAuction">Confirm</button>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import moment from 'moment'
	import reduce from 'lodash/collection/reduce'

	import ServiceMixin from '../mixins/services.js'

	import Timer from './timer.vue'

	export default {
		mixins: [ServiceMixin],

		components: {
			Timer,
		},
		computed:   {
			biddingEndingTime: function () {
				var mustBeBefore = null;

				if (this.currentMaximumBid && this.currentMaximumBid.bidTime) {
					mustBeBefore = moment(this.currentMaximumBid.bidTime).add(this.settings.timer, 's').subtract(this.serverOffset, 'ms')
				}
				if (this.item.minEndTime) {
					var minEndTime = moment(this.item.minEndTime)
					if (mustBeBefore && mustBeBefore.isBefore(minEndTime)) {
						mustBeBefore = minEndTime
					} else {
						mustBeBefore = minEndTime
					}

				}
				return mustBeBefore || moment().add(this.settings.timer, 's')
			},

			biddingStartTime: function () {
				return moment(this.item.startTime).subtract(this.serverOffset, 'ms') || moment()
			},

			biddingStarted: function () {
				return this.biddingStartTime.isBefore(this.now)
			},

			currentMaximumBid: function () {
				return reduce(this.bids, function (highestBid, bid) {
					if (!highestBid.amount || highestBid.amount < bid.amount) {
						return bid;
					}
					return highestBid;
				}, {})
			},

			maximumTeamBid: function () {
				if (!this.isTeam) return 0;

				var team = this.teams[this.isTeam]

				if (team) {
					return team.money
				} else {
					return 0
				}
			},
		},

		data: function () {
			return {
				bid:        0,
				bidErrors:  [],
				bids:       {},
				now:        Date.now(),
				sendingBid: false,
			}
		},

		filters: {

			formatTime: function (value) {
				return moment(value).subtract(this.serverOffset, 'ms').format('HH:mm:ss.SSS')
			},

		},

		methods: {
			confirmAuction: function () {
				var winner = this.currentMaximumBid

				this.$service('items').patch(this.item.id, {
					TeamId: winner.TeamId,
					sold:   winner.amount,
				})
				this.$service('teams').patch(winner.TeamId, {
					money: this.teams[winner.TeamId].money - winner.amount,
				})
				this.$service('settings').patch(1, {
					ItemId: null,
				})

			},

			sendBid: function () {
				if (this.sendingBid) return;
				this.sendingBid = true

				this.bidErrors = []

				if (this.bid < 1) {
					this.bidErrors.push('No bid entered')
				}

				var fallback = setTimeout(function () {
					this.sendingBid = false
				}.bind(this), 10000)

				this.$service('bids').create({
					amount: this.bid,
				}, function (error, response) {
					this.sendingBid = false
					clearTimeout(fallback)
					if (error) {
						if (error.errors && error.errors.length) {
							error.errors.map(function (error) {
								this.bidErrors.push(error.message)
							}.bind(this))
						} else {
							this.bidErrors.push(error.message)
						}
						return
					}
					this.bid = ''
				}.bind(this))
			},

			removeBid: function (id) {
				this.$service('bids').remove(id)
			}
		},

		props: {
			isAdmin:      Boolean,
			isTeam:       null,
			item:         Object,
			serverOffset: Number,
			settings:     {
				type:     Object,
				required: true,
			},
			teams:        {
				type:     Object,
				required: true,
			},
		},

		ready: function () {
			this._nowInterval = setInterval(function () {
				this.now = Date.now()
			}.bind(this), 100)

			this.$sync('bids', 'bids', {
				ItemId: this.item.id,
			})
		},

		destroyed: function () {
			clearInterval(this._nowInterval)
		},

		watch: {
			'item.id': function (id) {
				this.$unsync('bids')
				this.$sync('bids', 'bids', {
					ItemId: id,
				})
			}
		}
	}
</script>