<template>
	<div class="modal is-active">
		<div class="modal-background" @click.self="hideAdmin"></div>
		<div class="modal-content is-wide is-fullscreen">
			<div class="tile is-frame is-ancestor is-vertical box">
				<nav class="nav has-shadow">
					<div class="nav-left">
						<a class="nav-item is-tab"
							:class="{ 'is-active': page == 'settings' }"
							@click="setPage('settings')">
							Settings
						</a>
						<a class="nav-item is-tab"
							:class="{ 'is-active': page == 'teams' }"
							@click="setPage('teams')">
							Teams
						</a>
						<a class="nav-item is-tab"
							:class="{ 'is-active': page == 'items' }"
							@click="setPage('items')">
							Items
						</a>
						<a class="nav-item is-tab"
							:class="{ 'is-active': page == 'sessions' }"
							@click="setPage('sessions')">
							Sessions
						</a>
					</div>
					<div class="nav-right">
						<div class="nav-item">
							<button class="delete" @click="hideAdmin()"></button>
						</div>
					</div>
				</nav>
				<items-page v-if="page == 'items'" :items="items" :teams="teams"></items-page>
				<sessions-page v-if="page == 'sessions'" :sessions="sessions" :teams="teams" :user="user"></sessions-page>
				<settings-page v-if="page == 'settings'" :settings="settings"></settings-page>
				<teams-page v-if="page == 'teams'" :teams="teams"></teams-page>
			</div>
		</div>
	</div>
</template>

<script>
	import ItemsPage from './admin/Items.vue'
	import SessionsPage from './admin/Sessions.vue'
	import SettingsPage from './admin/Settings.vue'
	import TeamsPage from './admin/Teams.vue'

	export default {
		components: {
			ItemsPage,
			SessionsPage,
			SettingsPage,
			TeamsPage
		},
		data() {
			return {
				page: 'settings'
			}
		},
		methods: {
			hideAdmin() {
				this.$emit('toggle-admin', false)
			},
			setPage(page) {
				this.page = page
			}
		},
		props: {
			items: Object,
			sessions: Object,
			settings: Object,
			teams: Object,
			user: Object
		}
	}
</script>