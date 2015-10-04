var debug = require('debug')('nunjucks')

import fs from 'fs'

export default function (env) {

	// Rev'd asset file giver
	fs.exists(__dirname + '/../../public/rev-manifest.json', function (exists) {
		if (exists) {
			debug('assets: production');
//			var mapping = require('../../public/rev-manifest.json');
			var mapping = fs.readFileSync(__dirname + '/../../public/rev-manifest.json', {encoding: 'utf8'});
			mapping = JSON.parse(mapping);
			if (!mapping) {
				mapping = {};
			}

			env.addFilter('asset', function(location) {
				location = mapping[location] ? mapping[location] : location;
				return location.indexOf('/') === 0 ? location : '/' + location;
			});
		} else {
			debug('assets: dev');

			env.addFilter('asset', function(location) {
				return location.indexOf('/') === 0 ? location : '/' + location;
			});
		}
	});

}