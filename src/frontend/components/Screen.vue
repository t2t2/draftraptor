<template>
	<div class="screen tile is-vertical">
		<auction v-if="settings && settings.item_id" :connection="connection" :item="currentItem" :settings="settings" :teams="teams" :user="user"></auction>
		<slate v-if="settings && !settings.item_id" :connection="connection" :items="items" :settings="settings" :teams="teams" :user="user"></slate>
	</div>
</template>

<script>
	import Auction from './Auction.vue'
	import Slate from './Slate.vue'

	export default {
		components: {
			Auction,
			Slate
		},
		computed: {
			currentItem() {
				const itemID = this.settings.item_id
				if (itemID && this.items[itemID]) {
					return this.items[itemID]
				}
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