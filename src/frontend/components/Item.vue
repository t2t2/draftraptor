<template>
	<div class="item-wrap tile is-child">
		<div class="item card">
			<header class="card-header" :class="[ownerTeam ? 'team-background-' + ownerTeam.color : '']">
				<p class="card-header-title" v-text="item.name"></p>
			</header>
			<footer class="card-footer" v-if="user && user.admin">
				<a class="card-footer-item" @click="setCurrentAuction">Start</a>
			</footer>
		</div>
	</div>
</template>

<script>
	export default {
		computed: {
			ownerTeam() {
				if (this.item.team_id) {
					return this.teams[this.item.team_id]
				} else {
					return null
				}
			}
		},
		methods: {
			setCurrentAuction() {
				this.$emit('set-current-auction')
			}
		},
		props: {
			item: Object,
			teams: Object,
			user: null
		}
	}
</script>