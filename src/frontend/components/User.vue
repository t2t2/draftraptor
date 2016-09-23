<template>
	<span class="tag">
		<span v-text="userText"></span>
		<button class="button is-small is-link"
			@click="toggleLogin">
			Login
		</button>
		<button class="button is-small"
			@click="toggleAdmin"
			v-if="user && user.admin">
			Admin
		</button>
	</span>
</template>

<script>
	export default {
		computed: {
			userText() {
				if(this.user) {
					let text = 'Hi ' + this.user.username
					if (this.user.admin) {
						text += ' (Admin Mode)'
					}
					return text
				} else {
					return 'Guest mode'
				}
			}
		},
		methods: {
			toggleAdmin() {
				this.$emit('toggle-admin')
			},
			toggleLogin() {
				this.$emit('toggle-login')
			}
		},
		props: {
			user: null
		}
	}
</script>