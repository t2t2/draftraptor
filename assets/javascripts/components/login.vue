<template>
<div class="modal-overlay" v-on="click: hideModal" v-class="is-active: shown" v-el="overlay">
	<aside class="modal">
		<a class="close-button" v-on="click: hideModal()"><i class="material-icons">close</i></a>

		<h3>Login</h3>

		<div class="alert-box alert" v-repeat="error in errors" v-text="error"></div>
		<label>
			Username
			<input type="text" v-model="username" v-on="keyup: doLogin | key 'enter'">
		</label>
		<label>
			Access Code
			<input type="password" v-model="accessCode" v-on="keyup: doLogin | key 'enter'">
		</label>
		<button class="button expand" v-on="click: doLogin">Enter</button>
	</aside>
</div>
</template>

<script>
	export default {
		data: function () {
			return {
				errors:     [],
				shown:      false,
				username:   '',
				accessCode: '',
			}
		},

		methods: {
			doLogin:   function () {
				this.errors = []
				if (!this.username) {
					this.errors.push('Enter username')
				}
				if (!this.accessCode) {
					this.errors.push('Enter access code')
				}
				if (this.errors.length) return

				this.$root.$feathers.login(this.username, this.accessCode, function (errors, result) {
					if (errors) {
						this.errors.push(errors.error)
						return
					}

					this.hideModal()
					this.accessCode = ''
					var message = 'Logged in as ';
					if(result.admin && result.team) {
						message += 'Admin and Team'
					} else if(result.admin) {
						message += 'Admin'
					} else if(result.team) {
						message += 'Team'
					}

					this.$dispatch('notification', {
						message: message,
					})
				}.bind(this))
			},
			hideModal: function (event) {
				if (event && event.target != this.$$.overlay) {
					return
				}
				this.shown = false
			},
		},

		props: {
			shown: {
				type:   Boolean,
				twoway: true,
			},
		},
	}
</script>