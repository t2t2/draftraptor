<template>
	<div class="tile is-vertical">
		<div class="tile is-narrow">
			<div class="tile is-child">
				<nav class="nav is-primary">
					<div class="nav-left">
						<div class="nav-item is-brand">
							Draftraptor
						</div>
					</div>
					<div class="nav-right">
						<div class="nav-item">
							<user :user="user" @toggle-admin="toggleAdmin" @toggle-login="toggleLogin"></user>
							<div class="tag">
								<span class="icon">
									<i class="material-icons">network_wifi</i>
								</span>
								<span :title="'Server offset: ' + connection.offset + 'ms'">{{ connection.latency }}ms</span>
							</div>
						</div>
					</div>
				</nav>
				<login v-if="showLogin" :user="user" @toggle-login="toggleLogin"></login>
			</div>
		</div>
		<div class="tile" v-if="!$loadingSyncers">
			<div class="tile is-vertical">
				<screen :connection="connection" :items="items" :settings="settings" :teams="teams" :user="user"></screen>
			</div>
			<div class="tile is-parent is-vertical is-3">
				<div class="tile is-child">
					<sidebar :sessions="sessions" :settings="settings"></sidebar>
				</div>
			</div>
		</div>
		<div class="tile is-narrow is-vertical" v-if="!$loadingSyncers">
			<teams :items="items" :sessions="sessions" :settings="settings" :teams="teams" :user="user"></teams>
		</div>

		<admin v-if="isAdmin && showAdmin" :items="items" :sessions="sessions" :settings="settings" :teams="teams" :user="user" @toggle-admin="toggleAdmin"></admin>
	</div>
</template>

<script>
	import Admin from './Admin.vue'
	import Login from './Login.vue'
	import Screen from './Screen.vue'
	import Sidebar from './Sidebar.vue'
	import Teams from './Teams.vue'
	import TopBar from './TopBar.vue'
	import User from './User.vue'

	export default {
		computed: {
			isAdmin() {
				return !!(this.user && this.user.admin)
			}
		},
		components: {
			Admin,
			Login,
			Screen,
			Sidebar,
			Teams,
			TopBar,
			User
		},
		data() {
			return {
				showAdmin: false,
				showLogin: false
			}
		},
		methods: {
			toggleAdmin(value) {
				this.showAdmin = value !== undefined ? value : !this.showAdmin
			},
			toggleLogin(value) {
				this.showLogin = value !== undefined ? value : !this.showLogin
			}
		},
		props: {
			connection: Object,
			user: null
		},
		sync: {
			items: 'api/items',
			sessions: 'api/sessions',
			settings: {
				service: 'api/settings',
				id() {
					return 1
				}
			},
			teams: 'api/teams'
		}
	}
</script>