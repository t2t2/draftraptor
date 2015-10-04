module.exports = function Unauthorized(message, extra) {
	Error.captureStackTrace(this, this.constructor)
	this.name = this.constructor.name
	this.message = message
	this.extra = extra
	this.code = 401
};

require('util').inherits(module.exports, Error);