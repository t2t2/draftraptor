<template>
	<div class="title-bar primary">
		<span class="title left">Draftraptor</span>
		<div class="connection right">
			<span title="Connection state">
				<i class="material-icons">signal_wifi_4_bar</i>
				{{ connection.latency }} ms
			</span>
			<button v-if="isAdmin"
			        class="button secondary"
			        @click="toggleAdmin">
				Admin
			</button>
		</div>
	</div>
</template>
<script>
	export default {
		methods: {
			toggleAdmin() {
				this.$emit('toggle-admin')
			}
		},
		props: {
			connection: Object,
			isAdmin: Boolean
		}
	}
</script>