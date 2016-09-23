<template>
	<div class="sidebar">
		<table class="table settings" v-if="settings">
			<colgroup>
				<col style="width: 40%">
				<col style="width: 60%">
			</colgroup>
			<tbody>
				<tr>
					<th>Money</th>
					<td v-text="settings.money"></td>
				</tr>
				<tr>
					<th>Bid Timer</th>
					<td v-text="settings.timer"></td>
				</tr>
				<tr>
					<th>Start Timer</th>
					<td v-text="settings.start_timer"></td>
				</tr>
			</tbody>
		</table>
		<div class="sessions" v-if="adminSessions.length">
			<h4>Connected Admins</h4>
			<ul class="sessions-list">
				<li v-for="session in adminSessions" track-by="id" v-text="session.username"></li>
			</ul>
		</div>
	</div>
</template>

<script>
	import filter from 'lodash/filter'

	export default {
		computed: {
			adminSessions() {
				return filter(this.sessions, session => {
					return session.admin
				})
			} 
		},
		props: {
			settings: Object,
			sessions: Object
		}
	}
</script>