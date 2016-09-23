<template>
	<div class="tile is-parent is-vertical">
		<div class="tile is-child is-narrow" v-if="errors">
			<errors :errors="errors"></errors>
		</div>
		<div class="tile is-child is-scrolling">
			<div class="control is-horizontal">
				<div class="control-label">
					<label :for="_uid +'-money'" class="label">Money</label>
				</div>
				<div class="control">
					<input
						class="input"
						type="number"
						:id="_uid + '-money'"
						:value="settings.money"
						@input="updateValue('money', $event) | debounce 500" />
				</div>
			</div>
			<div class="control is-horizontal">
				<div class="control-label">
					<label :for="_uid +'-timer'" class="label">Timer</label>
				</div>
				<div class="control">
					<input
						class="input"
						type="number"
						:id="_uid + '-timer'"
						:value="settings.timer"
						@input="updateValue('timer', $event) | debounce 500" />
				</div>
			</div>
			<div class="control is-horizontal">
				<div class="control-label">
					<label :for="_uid +'-start-timer'" class="label">Start Timer</label>
				</div>
				<div class="control">
					<input
						class="input"
						type="number"
						:id="_uid + '-start-timer'"
						:value="settings.start_timer"
						@input="updateValue('start_timer', $event) | debounce 500" />
				</div>
			</div>
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
			async updateValue(field, e) {
				this.errors = null
				
				try {
					await this.$service('api/settings').patch(1, {
						[field]: e.target.value
					})
				} catch(error) {
					e.target.value = this.settings[field]
					this.errors = error
				}
			}
		},
		props: {
			settings: Object
		}
	}
</script>