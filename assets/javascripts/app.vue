<template>
<div id="app" class="grid-frame vertical">
	<div class="title-bar primary">
		<span class="center"><button class="button secondary" v-on="click: showLogin">Login</button></span>
		<span class="title left">Draftraptor</span>

		<div class="connection right" v-class="connectionState" title="Connection state">
			<i class="material-icons">signal_wifi_4_bar</i>
			<span v-if="connection" v-text="ping + 'ms'"></span>
		</div>
	</div>
	<div class="grid-block content">
		<div class="main-content">
			<auction is-admin="{{isAdmin}}" is-team="{{isTeam}}" items="{{items}}" server-offset="{{serverOffset}}"
			         settings="{{settings}}" teams="{{teams}}"></auction>
			<div class="action-log" style="display: none;">
				<div class="action-log-header">
					Log
				</div>
				<ul class="action-log-content">
				</ul>
			</div>
			<div class="grid-content shrink footer">
				Powered by Draftraptor - <a href="https://github.com/t2t2/draftraptor">github.com/t2t2/draftraptor</a>
			</div>
		</div>
		<div class="grid-content medium-4">
			<settings-card settings="{{settings}}" is-admin="{{isAdmin}}"></settings-card>

			<teams-card teams="{{teams}}" is-admin="{{isAdmin}}" on-toggle-crud="{{showTeamsCrud}}"></teams-card>

			<items-card items="{{items}}" is-admin="{{isAdmin}}" on-toggle-crud="{{showItemsCrud}}"></items-card>

		</div>
	</div>
	<login-screen shown="{{@ loginShown}}"></login-screen>
	<teams-crud v-if="isAdmin && teamsCrudShown" teams="{{teams}}" on-toggle="{{showTeamsCrud}}"></teams-crud>
	<items-crud v-if="isAdmin && itemsCrudShown" items="{{items}}" on-toggle="{{showItemsCrud}}"></items-crud>
</div>
</template>

<script>
	import ConnectionMixin from './mixins/connection'
	import ServicesMixin from './mixins/services'

	import Auction from './components/auction.vue'

	import SettingsCard from './components/cards/settings.vue'
	import LoginScreen from './components/login.vue'
	import TeamsCard from './components/cards/teams.vue'
	import ItemsCard from './components/cards/items.vue'

	import TeamsCrud from './components/crud/teams.vue'
	import ItemsCrud from './components/crud/items.vue'

	export default {
		mixins: [ConnectionMixin, ServicesMixin],

		components: {
			Auction,
			LoginScreen,
			ItemsCard,
			ItemsCrud,
			SettingsCard,
			TeamsCard,
			TeamsCrud,
		},

		data: function () {
			return {
				settings: {},
				items:    {},
				teams:    {},

				loginShown: false,

				teamsCrudShown: false,
				itemsCrudShown: false,
			}
		},

		events: {
			'notification': function (message) {
				console.log(message)
			}
		},

		methods: {
			showLogin:     function () {
				this.loginShown = true
			},
			showItemsCrud: function (value) {
				this.itemsCrudShown = value
			},
			showTeamsCrud: function (value) {
				this.teamsCrudShown = value
			},
		},

		sync: {
			'settings': 'settings/1',
			'items':    'items',
			'teams':    'teams',
		}
	}
</script>