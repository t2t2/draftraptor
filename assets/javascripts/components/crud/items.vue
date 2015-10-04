<template>
<div class="modal-overlay is-active large" v-on="click: hideModal" v-el="overlay">
	<aside class="modal grid-frame vertical">
		<div class="grid-content shrink">
			<a class="close-button" v-on="click: hideModal()"><i class="material-icons">close</i></a>

			<h3>Items</h3>
		</div>
		<div class="grid-content">
			<table class="full-table table-form">
				<thead>
				<tr>
					<th class="small-1">ID</th>
					<th>Name</th>
					<th>Sold For</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				<tr v-repeat="item in items">
					<td v-text="item.id" class="small-1"></td>
					<td>
						<sync-field type="text" value="{{item.name}}"
						            on-new-value="{{sendUpdate.bind(this, item.id, 'name')}}">
						</sync-field>
					</td>
					<td class="small-3">
						<sync-field type="number" value="{{item.sold}}"
						            on-new-value="{{sendUpdate.bind(this, item.id, 'sold')}}">
						</sync-field>
					</td>
					<td></td>
					<td>
						<button class="button alert" v-on="click: sendDelete(item.id)">Delete</button>
					</td>
				</tr>
				</tbody>
			</table>

		</div>
		<div class="grid-content shrink">
			<h4>Create new</h4>

			<div class="alert-box alert" v-repeat="error in create.errors" v-text="error"></div>

			<div class="grid-block">
				<div class="grid-content">
					<label>
						Name
						<input type="text" v-model="create.name">
					</label>
				</div>
			</div>
			<button class="button" v-on="click: createItem">Create</button>
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
				create: {
					errors: [],
					name:   '',
				},
			}
		},
		methods:    {
			createItem: function () {
				let errors = this.create.errors = []
				if (this.create.name.length < 2) {
					errors.push('Enter Name')
				}
				if (errors.length) return

				this.$service('items').create({
					name: this.create.name,
				}, function (error, response) {
					if (error) {
						if (error.errors && error.errors.length) {
							error.errors.map(function (error) {
								this.create.errors.push(error.message)
							}.bind(this))
						} else {
							this.create.errors.push(error.message)
						}
						return
					}
					this.create = {
						errors: [],
						name:   '',
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
				this.$service('items').remove(id, function (error, response) {

				}.bind(this))
			},
			sendUpdate: function (id, field, value, callback) {
				var request = {}

				request[field] = value

				this.$service('items').patch(id, request, function (error, response) {
					if (error) {
						callback(false)
					}
				}.bind(this))
			},
		},
		mixins:     [ServicesMixin],
		props:      {
			items:    {
				type:     Object,
				required: true,
			},
			onToggle: {
				type: Function,
			}
		}
	}
</script>