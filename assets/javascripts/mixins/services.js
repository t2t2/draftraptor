import connection from '../database/connection'
import Collection from '../database/collection'
import Item from '../database/item'

export default {
	methods: {

		$service: function (name) {
			return connection.service(name)
		},

		$sync: function (path, target, where = {}) {
			let [resource, id] = target.split('/')

			let syncer
			if (id) {
				syncer = new Item(resource, id)
				syncer.on('changed', () => {
					this.$set(path, syncer.item)
				})
			} else {
				syncer = new Collection(resource, where)
				this.$set(path, syncer.items)
			}
			this._syncers[path] = syncer
		},

		$unsync: function (path) {
			let syncer = this._syncers[path]
			if (syncer) {
				syncer.destroy()
			}
			delete this._syncers[path]
		},

	},

	destroyed: function () {
		Object.keys(this._syncers).map((path) => {
			this.$unsync(path)
		})
	},

	ready: function () {
		this._syncers = {}

		Object.keys(this.$options.sync).map((path) => {
			this.$sync(path, this.$options.sync[path])
		})
	},

	sync: {},
}