<template>
	<form class="login-form" @submit.prevent="doLogin">
		<errors v-if="errors" :errors="errors"></errors>
		<div class="columns">
			<div class="column">
				<p class="control">
					<label class="label" :for="_uid + '-username'">Name</label>
					<input class="input" type="text" v-model="username" :id="_uid + '-username'" @keyup.esc="toggleLogin(false)" />
				</p>
			</div>
			<div class="column">
				<label class="label" :for="_uid + '-code'">Auth Code</label>
				<p class="control">
					<input class="input" type="password" v-model="code" :id="_uid + '-code'" @keyup.esc="toggleLogin(false)" />
				</p>
			</div>
			<div class="column">
				<span class="label">&nbsp;</span>
				<button class="button is-primary is-fullwidth" type="submit">Login</button>
			</div>
			<div class="column is-narrow">
				<button class="delete" @click="toggleLogin(false)" type="button"></button>
			</div>
		</div>
	</form>
</template>

<script>
	import map from 'lodash/map'
	import remove from 'lodash/remove'
	import upperFirst from 'lodash/upperFirst'
	
	import Errors from './Errors.vue'

	export default {
		components: {
			Errors,
		},
		data() {
			const username = this.user ? 'Users name' : ''
			
			return {
				code: '',
				errors: null,
				username: ''
			}
		},
		ready() {
			if (this.user && this.user.username) {
				this.username = this.user.username
			}
		},
		methods: {
			async doLogin() {
				this.errors = null
				
				const credentials = {
					type: 'local',
					username: this.username,
					code: this.code
				}
				
				let errors = remove(map(credentials, (value, key) => {
					if (value.length <= 1) {
						return `${upperFirst(key)} must be entered`
					}
				}))
				
				if(errors.length) {
					this.errors = errors
					return
				}

				// Do login by itself, then use token to continue
				// (Needed to keep token around for re-logs)
				try {
					const {token} = await this.$service('auth/local').create(credentials)
					await this.$feathers.authenticate({
						type: 'token',
						token
					})

					this.toggleLogin(false)
				} catch(err) {
					this.errors = err
				}
			},
			toggleLogin(state) {
				this.$emit('toggle-login', state)
			}
		},
		props: {
			user: null
		}
	}
</script>