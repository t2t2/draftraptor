<template>
	<div class="auction tile is-vertical">
		<div class="auction-info tile is-narrow">
			<div class="tile is-parent">
				<div class="auction-info tile is-child">
					<h2 v-text="item.name" class="title"></h2>
				</div>
			</div>
			<div class="tile is-parent is-3" v-if="user && user.admin">
				<div class="auction-actions tile is-child">
					<button class="button is-primary is-fullwidth" @click="confirmAuction">Confirm Auction</button>
					<button class="button is-danger is-fullwidth" @click="cancelAuction">Cancel Auction</button>
					<button class="button is-fullwidth" @click="extendAuction">Extend by {{ settings.timer }}s</button>
				</div>
			</div>
		</div>
		<div class="tile">
			<div class="tile is-parent">
				<div class="tile is-child">
					<div style="height: 100%; overflow-y: auto;" data-shitty-chrome-fix>
						<bid v-for="bid in orderedBids" transition="hinge-from-bottom" track-by="id" :bid="bid" :teams="teams" :user="user"></bid>
					</div>
				</div>
			</div>
			<div class="tile is-parent is-vertical is-4">
				<div class="tile is-child is-narrow has-text-right" v-if="!biddingStarted">
					<h4 class="title is-4">Bidding Starts In</h4>
					<timer class="subtitle is-4" :target="biddingStartTime"></timer>
				</div>
				<div class="tile is-child is-narrow has-text-right" v-if="biddingStarted">
					<h4 class="title is-4">Bidding Ends In</h4>
					<component :is="timerShown" transition="fade" transition-mode="out-in" class="subtitle is-4" :target="biddingEndTime"></component>
				</div>
				<div class="tile is-scrolling is-child" v-if="usersTeam">
					<h3 class="title is-3">Bid</h3>

					<p class="control has-addons" v-if="bid >= settings.money">
						<input
							class="input is-expanded"
							style="width: 5rem"
							type="number"
							v-model="share"
							number
							min="0"
							max="100"
							@keyup.enter="sendBid">
						<span class="button">% for</span>
					</p>

					<p class="control has-addons">
						<input
							class="input is-expanded"
							style="width: 5rem"
							type="number"
							v-model="bid"
							number
							min="0"
							:max="maxBid"
							@keyup.enter="sendBid">
						<button class="button" v-text="'/ ' + maxBid" @click="setBidToMax"></button>
						<button class="button" @click="sendBid">Bid</button>
					</p>

					<errors v-if="errors" :errors="errors" @click="clearErrors"></errors>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import first from 'lodash/first'
	import orderBy from 'lodash/orderBy'
	import moment from 'moment'
	import some from 'lodash/some'

	import Bid from './Bid.vue'
	import Errors from './Errors.vue'
	import Timer from './Timer.vue'

	export default {
		components: {
			Bid,
			Errors,
			Timer,
			WaitingForBids: {
				template: '<div>Waiting For Bids...</div>'
			},
			BidUnbeatable: {
				template: '<div>Bid Can\'t Be Beaten</div>'
			}
		},
		computed: {
			biddingEndTime() {
				let endTime = null

				if (this.currentHighestBid && this.currentHighestBid.bid_time) {
					endTime = moment(this.currentHighestBid.bid_time).add(this.settings.timer, 's').subtract(this.connection.offset, 'ms')
				}
				if (this.item.min_end_time) {
					const minEndTime = moment(this.item.min_end_time).subtract(this.connection.offset, 'ms')
					if (!endTime || endTime.isBefore(minEndTime)) {
						endTime = minEndTime
					}
				}

				return endTime
			},
			biddingStartTime() {
				return moment(this.item.start_time).subtract(this.connection.offset, 'ms')
			},
			biddingStarted() {
				return this.biddingStartTime.isBefore(this.now)
			},
			bidUnbeatable() {
				return !some(this.teams, team => {
					if (this.currentHighestBid) {
						const highestBid = this.currentHighestBid
						if (highestBid.team_id === team.id) {
							return false
						} else if (highestBid.amount < team.money) {
							return true
						} else if (highestBid.amount === this.settings.money) {
							return team.money === this.settings.money && highestBid.share > 1
						}
						return false
					}
					return true
				})
			},
			currentHighestBid() {
				return first(this.orderedBids)
			},
			maxBid() {
				if (this.usersTeam) {
					return this.usersTeam.money
				}
				return 0
			},
			orderedBids() {
				return orderBy(this.bids, ['id'], ['desc'])
			},
			timerShown() {
				if (!this.biddingEndTime) {
					return 'waiting-for-bids'
				} else if(this.bidUnbeatable) {
					return 'bid-unbeatable'
				} else {
					return 'timer'
				}
			},
			usersTeam() {
				const teamId = this.connection.user && this.connection.user.team_id

				if (teamId && teamId in this.teams) {
					return this.teams[teamId]
				}
				return null
			}
		},
		data() {
			return {
				bid: 0,
				bidding: false,
				errors: null,
				now: Date.now(),
				share: 100
			}
		},
		methods: {
			async cancelAuction() {
				var id = this.item.id

				await this.$service('api/items').patch(id, {
					min_end_time: null,
					start_time: null
				})
				await this.$service('api/settings').patch(1, {
					item_id: null
				})
			},
			clearErrors() {
				this.errors = null
			},
			async confirmAuction() {
				const winningBid = this.currentHighestBid

				await Promise.all([
					this.$service('api/items').patch(this.item.id, {
						sold: winningBid.amount,
						team_id: winningBid.team_id
					}),
					await this.$service('api/teams').patch(winningBid.team_id, {
						money: this.teams[winningBid.team_id].money - winningBid.amount
					}),
					await this.$service('api/settings').patch(1, {
						item_id: null
					})
				])
			},
			async extendAuction() {
				await this.$service('api/items').patch(this.item.id, {
					min_end_time: moment().add(this.settings.timer, 's').add(this.connection.offset, 'ms')
				})
			},
			async sendBid() {
				if (this.sendingBid) return
				this.sendingBid = true
				this.clearErrors()

				try {
					await this.$service('api/bids').create({
						amount: this.bid,
						share: this.bid === this.settings.money ? this.share : 100
					})
				} catch(err) {
					this.errors = err
				}
				this.sendingBid = false
			},
			setBidToMax() {
				this.bid = this.maxBid
			}
		},
		props: {
			connection: Object,
			item: Object,
			settings: Object,
			teams: Object,
			user: Object
		},
		ready() {
			this._nowInterval = setInterval(() => {
				this.now = Date.now()
			}, 100)
		},
		destroyed: function () {
			clearInterval(this._nowInterval)
		},
		sync: {
			bids: {
				service: 'api/bids',
				query() {
					return {
						item_id: this.item.id
					}
				}
			}
		},
		watch: {
			'currentHighestBid ? currentHighestBid.amount : 0': {
				handler(newVal, oldVal) {
					// Set bid to max money to show % if someone bids that much 
					if (newVal === this.settings.money && oldVal <= newVal) {
						this.bid = this.settings.money
					} else if(newVal <= oldVal && oldVal === this.settings.money) {
						this.bid = 0
					}
				},
				immediate: true
			}
		}
	}
</script>