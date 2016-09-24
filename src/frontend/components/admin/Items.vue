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
					<col style="width:20%">
					<col style="width:30%">
					<col style="width:2%">
				</colgroup>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Sold For</th>
						<th>Team</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in items">
						<td class="text-center" v-text="item.id"></td>
						<td>
							<p class="control">
								<input type="text" class="input" :value="item.name" @input="updateItem(item.id, 'name', $event) | debounce 500" />
							</p>
						</td>
						<td>
							<p class="control">
								<input type="number" class="input" :value="item.sold" @input="updateItem(item.id, 'sold', $event) | debounce 500" />
							</p>
						</td>
						<td>
							<p class="control">
								<span class="select is-fullwidth">
									<select
										:value="item.team_id || 0"
										@change="updateItem(item.id, 'team_id', $event)">
										<option :value="0">(No Team)</option>
										<option
											v-for="team in teams"
											:value="team.id"
											:class="'team-color-' + team.color">
											{{ team.name }}
										</option>
									</select>
								</span>
							</p>
						</td>
						<td>
							<button class="button delete is-danger" @click="deleteItem(item.id)"></button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="tile is-child is-narrow">
			<h4>Create new</h4>
			<form @submit.prevent="createItem">
				<div class="columns is-sidepadded is-marginless">
					<div class="column">
						<label class="label" :for="_uid + '-new-name'">
							Name
						</label>
						<p class="control">
							<input type="text" class="input" v-model="create.name" :id="_uid + '-new-name'" />
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
				create: defaultNewItem(),
				errors: null
			}
		},
		methods: {
			clearErrors() {
				this.errors = null
			},
			async createItem() {
				this.errors = null
				
				try {
					await this.$service('api/items').create(this.create)
					
					this.create = defaultNewItem()
				} catch(error) {
					this.errors = error
				}
			},
			async deleteItem(id) {
				this.errors = null
				
				try {
					await this.$service('api/items').remove(id)
				} catch(error) {
					this.errors = error
				}
			},
			async updateItem(id, field, e) {
				this.errors = null
				let value = e.target.value

				// hack for no team
				if (field === 'team_id' && value == 0) {
					value = null
				}

				try {
					await this.$service('api/items').patch(id, {
						[field]: value
					})
				} catch(error) {
					e.target.value = this.items[id][field]
					this.errors = error
				}
			}
		},
		props: {
			items: Object,
			teams: Object
		}
	}
	
	function defaultNewItem() {
		return {
			name: ''
		}
	}
</script>