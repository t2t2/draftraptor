<template>
	<div class="team-box" :class="'team-box-color-' + team.color">
		<div class="team-box-header" :title="team.name">
			<span class="team-name" v-text="team.name"></span>
			<span class="team-money" v-text="team.money"></span>
		</div>
		<ul class="team-sessions">
			<li v-for="session in teamSessions" v-text="session.username"></li>
		</ul>
		<progress class="progress team-money-progress" :class="'team-progress-color-' + team.color" :value="team.money" :max="settings.money"></progress>
		<ul class="team-items">
			<li v-for="item in teamItems" v-text="item.name"></li>
		</ul>
	</div>
</template>

<script>
	import filter from 'lodash/filter'
	import sampleSize from 'lodash/sampleSize'

	export default {
		computed: {
			teamItems() {
				return filter(this.items, item => {
					return item.team_id == this.team.id
				})
			},
			teamSessions() {
				return filter(this.sessions, session => {
					return session.team_id == this.team.id
				})
			}
		},
		props: {
			items: Object,
			settings: Object,
			sessions: Object,
			team: Object
		}
	}
</script>