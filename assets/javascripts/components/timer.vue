<template>
	<div class="timer" v-text="timeDiff + 's'"></div>
</template>

<script>
	export default {
		computed: {
			timeDiff: function () {
				var time = this.targetTime.diff(this.now, 'ms') / 1000
				return (time > 0 ? time : 0).toFixed(1)
			}
		},
		data: function () {
			return {}
		},
		props: {
			now: null,
			targetTime: null,
		}
	}
</script>