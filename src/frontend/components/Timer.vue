<template>
	<div class="timer" v-text="timeDiff + 's'"></div>
</template>

<script>
	export default {
		computed: {
			timeDiff: function () {
				var time = this.target.diff(this.now, 'ms') / 1000
				return (time > 0 ? time : 0).toFixed(1)
			}
		},
		data: function () {
			return {
				now: Date.now()
			}
		},
		props: {
			target: null,
		},
		ready() {
			this._nowInterval = setInterval(() => {
				this.now = Date.now()
			}, 90)
		},
		destroyed: function () {
			clearInterval(this._nowInterval)
		}
	}
</script>