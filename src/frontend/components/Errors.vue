<template>
	<div class="notification is-danger">
		<h3 v-if="errorText" v-text="errorText"></h3>
		<ul v-if="errorList.length">
			<li v-for="error in errorList" v-text="error"></li>
		</ul>
	</div>
</template>

<script>
	import isArray from 'lodash/isArray'
	import map from 'lodash/map'

	export default {
		computed: {
			errorList: function() {
				if(!this.errors) {
					return []
				}
				if(isArray(this.errors)) {
					return this.errors
				}
				if('errors' in this.errors) {
					return map(this.errors.errors, error => {
						if (typeof error === 'string') {
							return error
						} else {
							return error.message
						}
					})
				}
				return []
			},
			errorText: function () {
				if(!this.errors) {
					return null
				}
				if('message' in this.errors) {
					return this.errors.message
				}
				return null
			},
		},
		data: function () {
			return {}
		},
		props: {
			errors: {
				type: [Object, Array, Error],
				required: true
			}
		}
	}
</script>