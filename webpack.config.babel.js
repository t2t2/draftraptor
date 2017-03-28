import path from 'path'

import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ManifestPlugin from 'webpack-manifest-plugin'
import webpack from 'webpack'

export default function ({
	prod = false
} = {}) {
	const outFolder = prod ? path.resolve(__dirname, './build/public/assets') : path.resolve(__dirname, './src/public/assets')
	const plugins = [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new webpack.LoaderOptionsPlugin({
			options: {
				babel: {
					presets: [
						['es2015', {modules: false}]
					],
					plugins: ['transform-runtime']
				}
			}
		})
	]

	return {
		entry: {
			main: ['./src/frontend/main.js', './src/frontend/style/main.scss'],
			polyfill: ['core-js/es6/array', 'core-js/es6/object', 'core-js/es6/promise']
		},
		output: {
			filename: prod ? '[name].[chunkhash].bundle.js' : '[name].js',
			path: outFolder,
			publicPath: '/assets/',
			chunkFilename: prod ? '[name].[id].[chunkhash].js' : '[name].[id].js'
		},
		module: {
			rules: [
				{
					// Vue files
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					// JS
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					// Sass
					test: /\.scss$/,
					// Disable sass minification so css-loader handles it
					loader: prod ? ExtractTextPlugin.extract(['css-loader', 'sass-loader?outputStyle=nested']) : ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					// JaaaaSON
					test: /\.json$/,
					loader: 'json-loader'
				},
				{
					// Images and other shenaniganiganidingdongs
					test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
					loader: 'url-loader',
					query: {
						limit: 10000,
						name: prod ? '[name].[hash:7].[ext]' : '[name].[ext]'
					}
				}
			]
		},
		plugins: plugins.concat(prod ?
			[
				new ManifestPlugin({
					basePath: '/assets/',
					fileName: '../manifest.json'
				}),
				new ExtractTextPlugin('[name].[contenthash].css'),
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: '"production"'
					}
				}),
				new webpack.optimize.UglifyJsPlugin({
					compress: {
						warnings: false
					}
				})
			] : []
		)
	}
}
