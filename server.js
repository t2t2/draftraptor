require('babel-core/register')

// Preload debug settings
var config = require('./app/config')

if(config.debug) {
	require('debug').enable(config.debug)
}

// Boot server
global.app = require('./app/server')