<template>
	<div id="app" class="tile is-frame is-vertical">
		<div class="connecting" v-if="!connection.connected">
			<div class="connecting-info">
				<div class="spinner">
					<div class="bounce1"></div>
					<div class="bounce2"></div>
					<div class="bounce3"></div>
				</div>

				<h2 class="title is-2">Draftraptor</h2>
				<h3 class="subtitle is-3" v-text="connection.reason"></h3>
			</div>
		</div>
		
		<Frontend :connection="connection" :user="user" v-if="connection.connected"></Frontend>
	</div>
</template>

<script>
	import Frontend from './components/Frontend.vue'

	import connectionMixin from './mixins/connection'

	export default {
		mixins: [connectionMixin],
		components: {
			Frontend
		},
		computed: {
			user() {
				return this.connection.user
			}
		},
		data() {
			return {}
		}
	}

</script>