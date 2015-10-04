<template>
<div class="card no-border">
	<div class="card-header">
		<h3>Settings</h3>
	</div>
	<ul class="feature-list" v-if="!isAdmin">
		<li>
			<span class="text" title="Default Money">Default Money:</span>
			<span class="value" v-text="settings.money"></span>
		</li>
		<li>
			<span class="text" title="Timer">Timer:</span>
			<span class="value" v-text="settings.timer"></span>
		</li>
		<li>
			<span class="text" title="Time before auction starts">Time before auction start:</span>
			<span class="value" v-text="settings.startTimer"></span>
		</li>
	</ul>
	<div class="card-section" v-if="isAdmin">
		<sync-field label="Money" type="number" value="{{settings.money}}"
		            on-new-value="{{sendUpdate.bind(this, 'money')}}"></sync-field>
		<sync-field label="Timer" type="number" value="{{settings.timer}}"
		            on-new-value="{{sendUpdate.bind(this, 'timer')}}"></sync-field>
		<sync-field label="Start Timer" type="number" value="{{settings.startTimer}}"
		            on-new-value="{{sendUpdate.bind(this, 'startTimer')}}"></sync-field>
	</div>
</div>
</template>

<script>
	import SyncField from '../sync-field.vue'

	import ServicesMixin from '../../mixins/services'

	export default {
		mixins: [ServicesMixin],

		components: {
			SyncField,
		},

		data: function () {
			return {}
		},

		methods: {
			sendUpdate: function (field, value, callback) {
				var request = {}

				request[field] = value

				this.$service('settings').patch(1, request, function (error, response) {
					if (error) {
						callback(false)
					}
				}.bind(this))
			},

		},

		props: {
			settings: {
				type:     Object,
				required: true,
			},
			isAdmin:  Boolean,
		},
	}
</script>