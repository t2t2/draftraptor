var _ = require('lodash'),
	argv = require('minimist')(process.argv.slice(2)),
	fs = require('fs'),
	path = require('path');

var defaults = {
	database: {
		name:     'draftraptor',
		username: null,
		password: null,
		options:  {}
	},
	password: null,
};

var settings = {}

if (process.env.DATABASE_URL) {
	settings = {
		database: {
			url: process.env.DATABASE_URL,
		}
	}
} else {
	settings = {
		"database": {
			// Use local sqlite
			"options": {
				"dialect": "sqlite",
				"storage": "./database/database.sqlite"
			},
		},
	};
}

if(argv.debug) {
	settings.debug = '*,-express:*,-engine:*,-socket.io-parser'
}

if(process.env.ADMIN_PASSWORD) {
	settings.password = process.env.ADMIN_PASSWORD
} else if(argv.password) {
	settings.password = argv.password
}


module.exports = _.defaultsDeep(settings, defaults)