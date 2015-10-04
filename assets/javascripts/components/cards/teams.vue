<template>
<div class="card">
	<div class="card-header">
		<a class="float-right" v-if="isAdmin" v-on="click: showCrud()"><i class="material-icons">menu</i></a>

		<h3>Teams</h3>
	</div>
	<ul class="teams-list">
		<li class="team" v-repeat="team in teams" v-class="'team-background-' + team.color">
			<div class="team-dot" v-class="'team-color-' + team.color"></div>
			<div class="name" v-text="team.name"></div>
			<div class="money" v-text="team.money"></div>
		</li>
	</ul>
</div>
</template>

<script>
	export default {
		data: function () {
			return {}
		},
		methods: {
			showCrud: function () {
				this.onToggleCrud(true)
			}
		},
		props: {
			teams: {
				type:     Object,
				required: true,
			},
			isAdmin:  Boolean,
			onToggleCrud: {
				type: Function,
			}
		},
	}
</script>