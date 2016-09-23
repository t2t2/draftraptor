<template>
	<div class="tile is-parent is-vertical">
		<div class="tile is-child is-narrow" v-if="errors">
			<errors :errors="errors"></errors>
		</div>
		<div class="tile is-child is-scrolling">
			<table class="table is-narrow is-marginless">
				<colgroup>
					<col style="width:5%">
					<col style="width:35%">
					<col style="width:35%">
					<col style="width:20%">
					<col style="width:2%">
				</colgroup>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Colour</th>
						<th>Money</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="team in teams" class="is-hoverable" :class="'team-background-' + team.color">
						<td class="text-center" v-text="team.id"></td>
						<td>
							<p class="control">
								<input
									class="input"
									type="text"
									:value="team.name"
									@input="updateTeam(team.id, 'name', $event) | debounce 500" />
							</p>
						</td>
						<td>
							<p class="control">
								<span class="select is-fullwidth">
									<select
										:class="'team-color-' + team.color"
										:value="team.color"
										@change="updateTeam(team.id, 'color', $event)">
										<option
											v-for="color in colorOptions"
											:value="color"
											:class="'team-color-' + color">
											{{ color }}
										</option>
									</select>
								</span>
							</p>
						</td>
						<td>
							<p class="control">
								<input
									class="input"
									type="number"
									:value="team.money"
									@input="updateTeam(team.id, 'money', $event) | debounce 500" />
							</p>
						</td>
						<td>
							<button class="button delete is-danger" @click="deleteTeam(team.id)"></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="tile is-child is-narrow">
			<h4>Create new</h4>
			<form @submit.prevent="createTeam">
				<div class="columns is-sidepadded is-marginless">
					<div class="column">
						<label
							class="label"
							:for="_uid + '-new-name'">
							Name
						</label>
						<p class="control">
							<input
								type="text"
								class="input"
								v-model="create.name"
								:id="_uid + '-new-name'" />
						</p>
					</div>
					<div class="column">
						<label
							class="label"
							:for="_uid + '-new-auth-key'">
							Auth Key
						</label>
						<p class="control">
							<input
								type="text"
								class="input"
								v-model="create.auth_key"
								:id="_uid + '-new-auth-key'" />
						</p>
					</div>
					<div class="column">
						<label
							class="label"
							:for="_uid + '-new-color'">
							Colour
						</label>
						<p class="control">
							<span class="select is-fullwidth">
								<select
									v-model="create.color"
									:class="'team-color-' + create.color">
									<option
										v-for="color in colorOptions"
										:value="color"
										:class="'team-color-' + color">
										{{ color }}
									</option>
								</select>
							</span>
						</p>
					</div>
				</div>
				<button class="button" type="submit">Create</button>
			</form>
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
				create: defaultNewTeam(),
				colorOptions: [
					'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green',
					'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'white'
				],
				errors: null
			}
		},
		methods: {
			async createTeam() {
				this.errors = null
				
				try {
					await this.$service('api/teams').create(this.create)
					
					this.create = defaultNewTeam()
				} catch(error) {
					this.errors = error
				}
			},
			async deleteTeam(id) {
				this.errors = null
				
				try {
					await this.$service('api/teams').remove(id)
				} catch(error) {
					this.errors = error
				}
			},
			async updateTeam(id, field, e) {
				this.errors = null
				
				try {
					await this.$service('api/teams').patch(id, {
						[field]: e.target.value
					})
				} catch(error) {
					e.target.value = this.teams[id][field]
					this.errors = error
				}
			}
		},
		props: {
			teams: Object
		}
	}
	
	function defaultNewTeam() {
		return {
			name:    '',
			auth_key: '',
			color:   'white'
		}
	}
</script>