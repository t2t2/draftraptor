<template>
<div class="modal-overlay is-active large" v-on="click: hideModal" v-el="overlay">
	<aside class="modal">
		<a class="close-button" v-on="click: hideModal()"><i class="material-icons">close</i></a>

		<div class="grid-block vertical">
			<div class="grid-block">
				<h3>Teams</h3>
			</div>
			<div class="grid-block vertical">
				<table class="full-table table-form">
					<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Money</th>
						<th>Colour</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					<tr v-repeat="team in teams">
						<td v-text="team.id"></td>
						<td>
							<sync-field type="text" value="{{team.name}}"
							            on-new-value="{{sendUpdate.bind(this, team.id, 'name')}}">
							</sync-field>
						</td>
						<td>
							<sync-field type="number" value="{{team.money}}"
							            on-new-value="{{sendUpdate.bind(this, team.id, 'money')}}">
							</sync-field>
						</td>
						<td>
							<sync-field type="select" value="{{team.color}}" options="{{colorOptions}}"
							            on-new-value="{{sendUpdate.bind(this, team.id, 'color')}}">
							</sync-field>
						</td>
						<td><button class="button alert" v-on="click: sendDelete(team.id)">Delete</button></td>
					</tr>
					</tbody>
				</table>
			</div>
			<div class="grid-block vertical">
				<h4>Create new</h4>

				<div class="alert-box alert" v-repeat="error in create.errors" v-text="error"></div>

				<div class="grid-block">
					<div class="grid-block vertical">
						<label>
							Name
							<input type="text" v-model="create.name">
						</label>
					</div>
					<div class="grid-block vertical">
						<label>
							Auth Key
							<input type="text" v-model="create.authkey">
						</label>
					</div>
					<div class="grid-block vertical">
						<label>Colour</label>
						<select v-model="create.color" options="colorOptions"></select>
					</div>
				</div>
				<button class="button" v-on="click: createTeam">Create</button>
			</div>
		</div>
	</aside>
</div>

</template>

<script>
	import SyncField from '../sync-field.vue'

	import ServicesMixin from '../../mixins/services.js'

	export default {
		components: {
			SyncField,
		},
		data:       function () {
			return {
				create:       {
					errors:  [],
					name:    '',
					authkey: '',
					color:   'white',
				},
				colorOptions: [
					"red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green",
					"light-green", "lime", "yellow", "amber", "orange", "deep-orange", "white"
				]
			}
		},
		methods:    {
			createTeam: function () {
				let errors = this.create.errors = []
				if (this.create.name.length < 2) {
					errors.push('Enter Name')
				}
				if (this.create.authkey.length < 2) {
					errors.push('Enter Auth Key')
				}
				if (this.colorOptions.indexOf(this.create.color) == -1) {
					errors.push('Choose a color (how the hell did you manage to do this anyway)')
				}
				if (errors.length) return

				this.$service('teams').create({
					name:    this.create.name,
					authkey: this.create.authkey,
					color:   this.create.color,
				}, function (error, response) {
					if(error) {
						if(error.errors) {
							error.errors.map(function (error) {
								this.create.errors.push(error.message)
							}.bind(this))
						} else {
							this.create.errors.push(error.message)
						}
						return
					}
					this.create = {
						errors:  [],
						name:    '',
						authkey: '',
						color:   'white',
					};
				}.bind(this))
			},
			hideModal:  function (event) {
				if (event && event.target != this.$$.overlay) {
					return
				}
				this.onToggle(false)
			},
			sendDelete: function (id) {
				this.$service('teams').remove(id, function (error, response) {

				}.bind(this))
			},
			sendUpdate: function (id, field, value, callback) {
				var request = {}

				request[field] = value

				this.$service('teams').patch(id, request, function (error, response) {
					if(error) {
						callback(false)
					}
				}.bind(this))
			},
		},
		mixins:     [ServicesMixin],
		props:      {
			teams:    {
				type:     Object,
				required: true,
			},
			onToggle: {
				type: Function,
			}
		}
	}
</script>