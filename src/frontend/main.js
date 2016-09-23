/* eslint-env browser */
import Vue from 'vue'
import VueSyncersFeathers from 'vue-syncers-feathers'

import feathers from './feathers'
import App from './App.vue'

if (process.env.NODE_ENV !== 'production') {
	Vue.config.debug = true
}

// For ease of use
Vue.prototype.$feathers = feathers
Vue.prototype.$service = function (name) {
	return feathers.service(name)
}

Vue.use(VueSyncersFeathers, {
	driverOptions: {
		feathers
	}
})

// Set up instance
const app = new Vue({
	el: 'body',
	components: {
		App
	}
})

document.body.removeChild(document.getElementById('loading'))

if (process.env.NODE_ENV !== 'production') {
	global.draftraptor = app.$children[0]
	global.Vue = Vue
}
