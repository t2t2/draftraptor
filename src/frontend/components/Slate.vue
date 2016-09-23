<template>
	<div class="tile is-vertical">
		<div class="tile is-parent is-narrow">
			<div class="tile is-child">
				<h2 class="title is-3">Slate</h2>
			</div>
		</div>
		<div class="tile items">
			<item v-for="item in items" track-by="id" :item="item" :teams="teams" :user="user" @set-current-auction="setCurrentAuction(item.id)"></item>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'

	import Item from './Item.vue'

	export default {
		components: {
			Item
		},
		methods: {
			async setCurrentAuction(id) {
				await this.$service('api/settings').patch(1, {item_id: id})

				var changes = {
					start_time: moment().add(this.settings.start_timer, 's').add(this.connection.offset, 'ms'),
				}
				await this.$service('api/items').patch(id, changes)
			}
		},
		props: {
			connection: Object,
			items: Object,
			settings: Object,
			teams: Object,
			user: null
		}
	}
</script>