import {Settings} from '../models'

export default function () {
	return Settings.findById(1)
}