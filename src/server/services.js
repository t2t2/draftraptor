import bidsService from '../services/bids'
import itemsService from '../services/items'
import settingsService from '../services/settings'
import sessionsService from '../services/sessions'
import teamsService from '../services/teams'

export default function () {
	const app = this

	app.configure(bidsService)
	app.configure(itemsService)
	app.configure(settingsService)
	app.configure(sessionsService)
	app.configure(teamsService)
}
