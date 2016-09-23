<template>
	<div class="tile is-child is-marginless">
		<div class="team-list">
			<team v-for="team in teams" track-by="id" :items="items" :sessions="sessions" :settings="settings" :team="team">
			</team>
		</div>
	</div>
</template>
<script>
	import Team from './Team.vue'

	export default {
		components: {
			Team
		},
		props: {
			items: Object,
			sessions: Object,
			settings: Object,
			teams: Object,
			user: null
		}
	}
</script>