<template>
<div class="field">
	<partial name="{{partialId}}"></partial>
</div>
</template>

<script>
	import ServicesMixin from '../mixins/services'

	var id = 0;

	export default {
		mixins: [ServicesMixin],

		computed: {
			fieldID: function () {
				return 'input-sync-field-'+ this.fieldNum
			},
			partialId: function () {
				if (this.type == 'checkbox') {
					return 'checkbox'
				}
				if (this.type == 'select') {
					return 'select'
				}
				return 'inputText'
			},
		},
		data:     function () {
			return {
				fieldNum: 0,
				localValue: null,
			}
		},
		partials: {
			checkbox: '<input id="{{fieldID}}" type="checkbox" v-model="localValue"><label for="{{fieldID}}">{{label}}</label>',
			inputText: '<label>{{label}}<input type="{{type}}" v-model="localValue" debounce="500" /></label>',
			select: '<label for="{{fieldID}}">{{label}}</label><select id="{{fieldID}}" v-model="localValue" options="options"></select>'
		},
		props:    {
			label:   String,
			onNewValue: {
				type: Function,

			},
			options: Array,
			type:    {
				type:    String,
				default: 'text',
			},
			value:   {
				required: true,
			},
		},
		ready:    function () {
			this.fieldNum = id++;
			this.localValue = this.value

			this.$watch('value', function (newvalue) {
				this.localValue = newvalue
			})
			this.$watch('localValue', function (newvalue) {
				if (newvalue == this.value) return;

				if(this.onNewValue) {
					this.onNewValue(newvalue, function (success) {
						if(!success) {
							// Undo changes
							this.localValue = this.value
						}
					}.bind(this))
				}
			})
		},
	}
</script>