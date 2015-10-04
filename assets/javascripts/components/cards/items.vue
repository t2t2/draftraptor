<template>
<div class="card">
	<div class="card-header">
		<a class="float-right" v-if="isAdmin" v-on="click: showCrud()"><i class="material-icons">menu</i></a>

		<h3>Items</h3>
	</div>
	<ul class="items-list">
		<li class="item" v-repeat="item in items">
			<div class="name" v-text="item.name"></div>
		</li>
	</ul>
</div>
</template>

<script>
	export default {
		data: function () {
			return {}
		},
		methods: {
			showCrud: function () {
				this.onToggleCrud(true)
			}
		},
		props: {
			items: {
				type:     Object,
				required: true,
			},
			isAdmin:  Boolean,
			onToggleCrud: {
				type: Function,
			}
		},
	}
</script>