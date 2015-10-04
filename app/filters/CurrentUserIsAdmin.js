import {Unauthorized} from '../errors'

export default function ({data, params}) {
	if(params.admin) return;

	throw new Unauthorized("User Must Log in")
}