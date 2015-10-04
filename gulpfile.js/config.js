module.exports = {
	app: require('../app/config'),

	root: {
		src:  './assets',
		dest: './public'
	},

	tasks: {
		js: {
			src:             'javascripts',
			dest:            'javascripts',
			extractSharedJs: false,
			entries:         {
				app:  ['./boot/app.js'],
			},
			extensions:      ['js']
		},

		css: {
			src:          'stylesheets',
			dest:         'stylesheets',
			autoprefixer: {
				browsers: ['last 3 version']
			},
			sass:         {},
			extensions:   ['scss', 'css']
		},

		images: {
			src:        'images',
			dest:       'images',
			extensions: ['jpg', 'png', 'svg', 'gif']
		},

		fonts: {
			src:        'fonts',
			dest:       'fonts',
			extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg']
		},

	},

	migrations: {
		dest: './database/migrations'
	},
}
