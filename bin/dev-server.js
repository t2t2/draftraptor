// Based on https://github.com/vuejs-templates/webpack/blob/master/template/build/dev-server.js
import express from 'express'
import proxyMiddleware from 'http-proxy-middleware'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import WebpackNotifier from 'webpack-notifier'

import webpackConfig from '../webpack.config.babel'

let config = webpackConfig({
	prod: false
})

Object.keys(config.entry).forEach(function (name) {
	config.entry[name] = ['eventsource-polyfill', 'webpack-hot-middleware/client?reload=true'].concat(config.entry[name])
})

config.devtool = '#cheap-module-source-map'

config.plugins = (config.plugins || []).concat([
	// https://github.com/glenjamin/webpack-hot-middleware#installation--usage
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoErrorsPlugin(),
	// Neaties
	new WebpackNotifier()
])

const app = express()
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
}))
app.use(webpackHotMiddleware(compiler))
app.use(proxyMiddleware('/', {
	target: 'http://localhost:8000',
	ws: true
}))

app.listen(8080)
