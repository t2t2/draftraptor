import Vue from 'vue'

if(process.env.NODE_ENV !== 'production') {
	Vue.config.debug = true
}

import App from '../app.vue'


var app = new Vue(App).$mount('#app')

if(process.env.NODE_ENV !== 'production') {
	global.app = app
}