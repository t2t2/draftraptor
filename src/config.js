import config from 'config'
import debug from 'debug'

export default config

if (config.get('key') === 'ohgodfortheloveofthegodpleasechangemetoamoresecurestringokayokay') {
	console.error('PLEASE CHOOSE A MORE SECURE KEY')
}

if (config.get('key') === 'AlrightIllLetYouPassForThisTimeButPleaseMakeAMoreSecureKeyOkayOkay') {
	console.warn('Using development key!')
}

// Configure debug
if (config.get('debug')) {
	debug.enable(config.get('debug'))
}
