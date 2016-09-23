<template>
	<div class="level bid is-mobile" :class="'team-background-' + team.color">
		<div class="level-left">
			<div class="level-item">
				<p class="heading" v-text="team.name"></p>
				<p>{{ bid.username }} @ {{ time }}</p>
			</div>
		</div>
		<div class="level-right bid-right">
			<div class="level-item has-text-right">
				<p class="title is-2" v-if="bid.share !== 100" v-text="bid.share + '%'"></p>
				<p class="title is-5" v-if="bid.share !== 100" v-text="'for ' + bid.amount"></p>
				<p class="title is-1" v-if="bid.share === 100" v-text="bid.amount"></p>
			</div>
			<div class="level-item" v-if="user && user.admin">
				<button class="delete" @click="remove"></button>
			</div>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'

	export default {
		computed: {
			team() {
				return this.teams[this.bid.team_id]
			},
			time() {
				return moment(this.bid.bid_time).subtract(this.serverOffset, 'ms').format('HH:mm:ss.SSS')
			}
		},
		methods: {
			async remove() {
				return await this.$service('api/bids').remove(this.bid.id)
			}
		},
		props: {
			bid: Object,
			teams: Object,
			user: Object
		}
	}
</script>