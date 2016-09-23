<template>
	<div class="tile is-parent is-vertical">
		<div v-if="errors" class="tile is-child is-narrow">
			<errors :errors="errors" @click="clearErrors"></errors>
		</div>
		<div class="tile is-child is-scrolling">
			<table class="table is-narrow is-marginless">
				<colgroup>
					<col style="width:5%">
					<col style="width:40%">
					<col style="width:40%">
					<col style="width:5%">
					<col style="width:2%">
				</colgroup>
				<thead>
					<tr>
						<th>ID</th>
						<th>Username</th>
						<th>Team</th>
						<th>Admin</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in sessions">
						<td class="text-center">
							{{item.id}}
							<span v-if="item.id == user.id" class="tag is-danger" title="That's you">!!!</span>
						</td>
						<td v-text="item.username"></td>
						<td>
							<span v-if="item.team_id" v-text="teams[item.team_id] ? teams[item.team_id].name : 'Unknown?'">Team</span>
							<em v-if="!item.team_id">No team</em>
						</td>
						<td class="text-center"><i class="material-icons" v-if="item.admin">check</i></td>
						<td>
							<button class="button delete is-danger" @click="deleteSession(item.id)"></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	import Errors from '../Errors.vue'

	export default {
		components: {
			Errors,
		},
		data() {
			return {
				errors: null
			}
		},
		methods: {
			deleteSession(id) {
				this.errors = null
				this.$service('api/sessions').remove(id).catch(error => {
					this.errors = error
				})
			}
		},
		props: {
			sessions: Object,
			teams: Object,
			user: Object
		}
	}
</script>