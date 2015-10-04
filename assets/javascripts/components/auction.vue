<template>
<div class="grid-block vertical auction">
	<div class="auction-items">
		<div class="auction-items-actions" v-if="isAdmin">
			<ul class="button-group expand">
				<li><a v-if="settings.ItemId" v-on="click: clearCurrentAuction()">Clear Auction</a></li>
			</ul>
		</div>
		<div class="auction-item-list" v-if="!settings.ItemId">
			<div class="auction-item" v-repeat="item in items" v-class="sold: item.TeamId !== null">
				<div class="name" v-text="item.name"></div>
				<button class="choose-item button" v-if="isAdmin" v-on="click: setCurrentAuction(item.id)">
					<i class="material-icons">keyboard_arrow_left</i>
				</button>
			</div>
		</div>
	</div>
	<div class="auction-current">
		<current-auction v-repeat="item in items | filterBy isCurrentItem" is-admin="{{isAdmin}}" is-team="{{isTeam}}"
		                 server-offset="{{serverOffset}}" settings="{{settings}}" teams="{{teams}}">
		</current-auction>
	</div>
	<h4 class="title">Money</h4>

	<div class="auction-teams">
		<div class="team" v-repeat="team in teams" v-text="team.money" v-attr="title: team.name"
		     v-class="'team-background-' + team.color"></div>
	</div>
</div>
</template>

<script>
	import moment from 'moment'
	import ServiceMixin from '../mixins/services.js'

	import CurrentAuction from './current-auction.vue'

	export default {
		mixins:     [ServiceMixin],
		components: {
			CurrentAuction,
		},
		data:       function () {
			return {}
		},
		methods:    {
			isCurrentItem: function ({ $value: item }) {
				return item.id == this.settings.ItemId
			},

			clearCurrentAuction: function () {
				var id = this.settings.ItemId

				this.$service('items').patch(id, {startTime: null})
				this.$service('settings').patch(1, {ItemId: null})
			},

			setCurrentAuction: function (id) {
				this.$service('settings').patch(1, {ItemId: id})

				var changes = {
					startTime: moment().add(this.settings.startTimer, 's').add(this.serverOffset, 'ms'),
				}
				this.$service('items').patch(id, changes)
			},
		},
		props:      {
			isAdmin:      Boolean,
			isTeam:       null,
			items:        {
				type:     Object,
				required: true,
			},
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
	}
</script>